import { Component, input, OnInit, computed, inject } from '@angular/core';
import {
  CarOrderUpdateDto,
  OrderControllerService,
} from '../../api';
import { firstValueFrom } from 'rxjs';
import { CarConfigOrderModal, ModalOptions } from './car-config-order-modal/car-config-order-modal';
import { CarConfigGeneralFunctionsService } from '../../service/car-config-general-functions.service';
import { CarConfigMenuTabs } from '../../models/car-config-menu-tabs';
import { CarTabMenuChangeService } from '../../service/car-config-menu-tabs.service';
import { CarConfigApiService } from '../../service/car-config-api.service';
import { Router } from '@angular/router';
import { CarConfigStoreService } from '../../service/car-config-store.service';

@Component({
  selector: 'app-car-config-order',
  imports: [],
  templateUrl: './car-config-order.component.html',
  styleUrl: './car-config-order.component.scss'
})
export class CarConfigOrderComponent implements OnInit {
  readonly createNewOrder = input<boolean>(false);
  readonly updateOrDeleteOrder = input<boolean>(false);
  readonly showOrderMenu = input<boolean>(false);

  private readonly carConfigStoreService = inject(CarConfigStoreService);
  private readonly orderControllerService = inject(OrderControllerService);
  private readonly carConfigOrderModal = inject(CarConfigOrderModal);
  private readonly carConfigGeneralFunctionsService = inject(CarConfigGeneralFunctionsService);
  private readonly carTabMenuChangeService = inject(CarTabMenuChangeService);
  private readonly carConfigApiService = inject(CarConfigApiService);
  private readonly router = inject(Router);

  // Direct signals - reactive to store updates
  readonly engineData = this.carConfigStoreService.engine;
  readonly colorData = this.carConfigStoreService.color;
  readonly rimData = this.carConfigStoreService.rims;
  readonly specialEquipments = this.carConfigStoreService.specialEquipment;

  // Computed signals for visibility
  readonly engineDataVisible = computed(() => this.engineData() !== null);
  readonly colorDataVisible = computed(() => this.colorData() !== null);
  readonly rimDataVisible = computed(() => this.rimData() !== null);


  readonly totalPrice = computed(() => {
    let total = 0;
    const engine = this.engineData();
    if (engine?.price) total += engine.price;

    const color = this.colorData();
    if (color?.price) total += color.price;

    const rim = this.rimData();
    if (rim?.price) total += rim.price;

    const equipments = this.specialEquipments();
    if (equipments) {
      equipments.forEach(e => {
        if (e.price) total += e.price;
      });
    }

    return total;
  });

  carMenuTabs: CarConfigMenuTabs | undefined;
  private receivedOrderNumber: string | undefined;
  isSending: boolean = false;
  showOrderMenuState: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    // Subscribe to menu tabs for state management
    this.carTabMenuChangeService.carConfigTabInfoData$?.subscribe((data) => {
      this.carMenuTabs = data;
      if (data?.showOrder) {
        this.showOrderMenuState = true;
      }
    });
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
      title: "Confirm order",
      message: 'Please confirm your order. Do you want to continue with the order?'
    }
    const confirmed = await this.carConfigOrderModal.open(modalOrderConfirm);
    if (confirmed) {
      await this.saveDeliveryToServer().then(orderId => this.showLinkOrderNumber(orderId)).catch(err => console.error(err));
    }
  }

  async showLinkOrderNumber(orderId: string) {
    let url = this.carConfigApiService.getApiOrderUrl() + "/" + orderId
    let modalOrderLink: ModalOptions = {
      modalType: "CONFIRM_ORDER",
      title: "OrderLink to your order",
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
    const equipments = this.specialEquipments();
    if (equipments) {
      return equipments[0].productId
    }
    return false;
  }

  receivedOrderLink() {
    const receivedOrderNumber = this.receivedOrderNumber;
    return receivedOrderNumber && receivedOrderNumber.length > 0;
  }

  canModifyOrderButtons() {
    return this.updateOrDeleteOrder() && !this.createNewOrder();
  }

  canCreateNewOrder() {
    const correctUnlockedTab = this.carMenuTabs?.tabRim;
    if (correctUnlockedTab) {
      if (!this.receivedOrderLink() && !this.createNewOrder()) {
        return true;
      }
    }
    return false;
  }

  showRearmOrderButton() {
    const correctUnlockedTab = this.carMenuTabs?.tabRim;
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
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.'
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
          title: 'Error',
          message: 'Could not delete the order. Please try again later.',
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
      title: "Shareable Link",
      message: url
    };
    await this.carConfigOrderModal.open(modalOption);
  }

  getShowOrderMenu(): boolean {
    return this.showOrderMenuState || this.showOrderMenu();
  }
}
