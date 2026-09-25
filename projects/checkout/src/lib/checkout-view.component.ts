import { Component, input, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CarOrderUpdateDto,
  OrderControllerService,
} from  '@carconfig/api-client';
import { firstValueFrom } from 'rxjs';
import { OrderModal, ModalOptions } from './order-modal/order-modal';
import { CarConfigStoreService, CarTabMenuChangeService } from '@carconfig/car-state';
import { ApiService, GeneralFunctionsService } from '@carconfig/shared';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { buildOrderLines, calculateTotalPrice } from './checkout-summary';

@Component({
  selector: 'app-checkout-view',
  imports: [FormsModule, TranslocoModule],
  templateUrl: './checkout-view.component.html',
  styleUrl: './checkout-view.component.scss'
})
export class CheckoutViewComponent {
  readonly createNewOrder = input<boolean>(false);
  readonly updateOrDeleteOrder = input<boolean>(false);
  readonly showOrderMenu = input<boolean>(false);

  private readonly carConfigStoreService = inject(CarConfigStoreService);
  private readonly orderControllerService = inject(OrderControllerService);
  private readonly carConfigOrderModal = inject(OrderModal);
  private readonly carConfigGeneralFunctionsService = inject(GeneralFunctionsService);
  private readonly carTabMenuChangeService = inject(CarTabMenuChangeService);
  readonly carMenuTabs = this.carTabMenuChangeService.carConfigTabInfoData;
  private readonly carConfigApiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);

  // Direct signals - reactive to store updates
  readonly engineData = this.carConfigStoreService.engine;
  readonly colorData = this.carConfigStoreService.color;
  readonly rimData = this.carConfigStoreService.rims;
  readonly specialEquipments = this.carConfigStoreService.specialEquipment;

  // Computed signals for visibility
  readonly engineDataVisible = computed(() => this.engineData() !== null);
  readonly colorDataVisible = computed(() => this.colorData() !== null);
  readonly rimDataVisible = computed(() => this.rimData() !== null);

  readonly orderLines = computed(() => buildOrderLines(
    this.engineData(), this.colorData(), this.rimData(), this.specialEquipments(),
  ));

  readonly totalPrice = computed(() => calculateTotalPrice(
    this.engineData(), this.colorData(), this.rimData(), this.specialEquipments(),
  ));

  private receivedOrderNumber: string | undefined;
  isSending: boolean = false;
  customerNumber = '';
  deliveryAddress = '';

  printOrderAsPdf(): void {
    const checkoutElement = document.querySelector('app-checkout-view');
    document.body.classList.add('printing-car-config-order');
    checkoutElement?.classList.add('print-order-target');

    const restoreScreen = () => {
      document.body.classList.remove('printing-car-config-order');
      checkoutElement?.classList.remove('print-order-target');
      window.removeEventListener('afterprint', restoreScreen);
    };

    window.addEventListener('afterprint', restoreScreen, { once: true });
    window.print();
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price)
    }
    return this.carConfigGeneralFunctionsService.formatCurrency(0)
  }

  async onOrderConfirmClick() {
    let modalOrderConfirm: ModalOptions = {
      modalType: "CONFIRM_ORDER",
      title: this.transloco.translate('checkout.confirmTitle'),
      message: this.transloco.translate('checkout.confirmMessage')
    }
    const confirmed = await this.carConfigOrderModal.open(modalOrderConfirm);
    if (confirmed) {
      const orderId = await this.saveDeliveryToServer();
      if (orderId) {
        this.carTabMenuChangeService.returnToConfigurator();
        await this.showLinkOrderNumber(orderId);
      }
    }
  }

  async showLinkOrderNumber(orderId: string) {
    let url = this.carConfigApiService.getApiOrderUrl() + "/" + orderId
    let modalOrderLink: ModalOptions = {
      modalType: "SHOW_SHARE_LINK",
      title: this.transloco.translate('checkout.createdTitle'),
      message: url
    }
    await this.carConfigOrderModal.open(modalOrderLink);
  }

  async saveDeliveryToServer(): Promise<string> {
    try {
      this.isSending = true;
      const savedTransport = await firstValueFrom(
        this.orderControllerService.createOrder(this.createOrder())
      );
      const orderId = savedTransport.orderId;
      if (orderId) {
        console.log('Order successfully stored:{}', orderId);
        this.receivedOrderNumber = orderId;
        return orderId;
      }
    } catch (error) {
      console.error('Error at sending the order to the server:', error);
    } finally {
      this.isSending = false;
    }
    return "";
  }

  private createOrder(): CarOrderUpdateDto {
    return {
      carColorProductId: this.colorData()?.productId,
      carEngineProductId: this.engineData()?.productId,
      carRimsProductId: this.rimData()?.productId,
      specialEquipmentProductIds: this.getSpecialEquipmentProductIds()
    };
  }

  private getSpecialEquipmentProductIds(): string[] {
    return this.specialEquipments()?.map(eq => eq.productId).filter((id): id is string => !!id) ?? [];
  }

  showSpecialEquipment() {
    return this.specialEquipments()?.some(equipment => !!equipment.productId) ?? false;
  }

  receivedOrderLink() {
    const receivedOrderNumber = this.receivedOrderNumber;
    return receivedOrderNumber && receivedOrderNumber.length > 0;
  }

  canModifyOrderButtons() {
    return this.updateOrDeleteOrder() && !this.createNewOrder();
  }

  canCreateNewOrder() {
    const correctUnlockedTab = this.carMenuTabs()?.tabRim;
    if (correctUnlockedTab) {
      if (!this.receivedOrderLink() && !this.createNewOrder()) {
        return true;
      }
    }
    return false;
  }

  showRearmOrderButton() {
    const correctUnlockedTab = this.carMenuTabs()?.tabRim;
    if (correctUnlockedTab) {
      if (this.receivedOrderLink() && !this.createNewOrder()) {
        return true;
      }
    }
    return false;
  }

  onRearmOrder() {
    this.receivedOrderNumber = "";
  }

  onModifyOrder() {
    this.router.navigateByUrl('/');
  }

  onDeleteOrder() {
    this.handleOrderDeletion();
  }

  private async handleOrderDeletion(): Promise<void> {
    let modalOption: ModalOptions = {
      modalType: "Show_DELETE",
      title: this.transloco.translate('checkout.deleteTitle'),
      message: this.transloco.translate('checkout.deleteMessage')
    }

    const confirmed = await this.carConfigOrderModal.open(modalOption);

    if (confirmed) {
      try {
        this.isSending = true;
        this.resetApplicationState();
      } catch (error) {
        console.error('Error deleting the order:', error);

        let modalCancelError: ModalOptions = {
          modalType: "Show_DELETE",
          title: this.transloco.translate('common.error'),
          message: this.transloco.translate('checkout.deleteError'),
        }
        await this.carConfigOrderModal.open(modalCancelError);
      } finally {
        this.isSending = false;
      }
    }
  }

  private resetApplicationState(): void {
    this.carConfigStoreService.reset();
    this.carTabMenuChangeService.reset();
    this.onRearmOrder();
    this.router.navigateByUrl('/');
  }

  async onShareClick() {
    const equipmentIds = this.getSpecialEquipmentProductIds();
    const paddedIds = Array.from({ length: 5 }, (_, i) => equipmentIds[i] || 'none');
    const specialEquipmentPath = paddedIds.join('/');

    const url: string = this.carConfigApiService.getApiProductUrl() + "/" +
      (this.engineData()?.productId || 'none') + "/" +
      (this.colorData()?.productId || 'none') + "/" +
      (this.rimData()?.productId || 'none') + "/" +
      specialEquipmentPath;

    let modalOption: ModalOptions = {
      modalType: "SHOW_SHARE_LINK",
      title: this.transloco.translate('checkout.shareTitle'),
      message: url
    };
    await this.carConfigOrderModal.open(modalOption);
  }

  getShowOrderMenu(): boolean {
    return this.showOrderMenu();
  }

  onBackToSelection(): void {
    this.carTabMenuChangeService.returnToConfigurator();
  }
}
