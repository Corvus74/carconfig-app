import {Component, Input, OnInit, effect} from '@angular/core';
import {CarConfigChangeService} from '../../service/car-config-change.service';
import {
  CarColorDto,
  CarEngineDto,
  CarOrderUpdateDto,
  CarRimDto,
  OrderControllerService,
  SpecialEquipmentDto
} from '../../api';
import {firstValueFrom} from 'rxjs';
import {CarConfigOrderModal, ModalOptions} from './car-config-order-modal/car-config-order-modal';
import {CarConfigGeneralFunctionsService} from '../../service/car-config-general-functions.service';
import {CarConfigMenuTabs} from '../../models/CarConfigMenuTabs';
import {CarTabMenuChangeService} from '../../service/car-config-menu-tabs.service';
import {CarConfigApiService} from '../../service/car-config-api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-car-config-order',
  imports: [],
  templateUrl: './car-config-order.component.html',
  styleUrl: './car-config-order.component.scss'
})
export class CarConfigOrderComponent implements OnInit {
  @Input() createNewOrder!: boolean;
  @Input() updateOrDeleteOrder!: boolean;
  @Input() showOrderMenu: boolean = false;
  engineData: CarEngineDto | undefined;
  colorData: CarColorDto | undefined;
  rimData: CarRimDto | undefined;
  specialEquipments: SpecialEquipmentDto[] | undefined;
  carMenuTabs: CarConfigMenuTabs | undefined;
  // using effects instead of manual subscriptions

  private receivedOrderNumber: string | undefined;
  // using effects instead of manual subscriptions

  totalPrice = 0
  isSending: boolean = false;

  constructor(private readonly carConfigChangedService: CarConfigChangeService,
              private readonly orderControllerService: OrderControllerService,
              private readonly carConfigOrderModal: CarConfigOrderModal,
              private readonly carConfigGeneralFunctionsService: CarConfigGeneralFunctionsService,
              private readonly carTabMenuChangeService: CarTabMenuChangeService,
              private readonly carConfigApiService: CarConfigApiService,
              private readonly router: Router) {
    // keep local fields in sync with signals and recalc price when needed
    effect(() => {
      this.engineData = this.carConfigChangedService.engineData();
      this.calculatePriceComplete();
    });
    effect(() => {
      this.colorData = this.carConfigChangedService.colorData();
      this.calculatePriceComplete();
    });
    effect(() => {
      this.rimData = this.carConfigChangedService.rimData();
      this.calculatePriceComplete();
    });
    effect(() => {
      this.specialEquipments = this.carConfigChangedService.specialEquipmentData();
      this.calculatePriceComplete();
    });
    effect(() => {
      const data = this.carTabMenuChangeService.carConfigTabInfoData();
      this.carMenuTabs = data;
      if (data?.showOrder) {
        this.showOrderMenu = true;
      }
    });
  } // Dialog statt alter Modal-"Service"
  // no manual unsubscribe required when using effects

  ngOnInit(): void {
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price)
    }
    return this.carConfigGeneralFunctionsService.formatCurrency(0)
  }

  calculatePriceComplete() {
    this.totalPrice = 0;
    this.addEnginePrice();
    this.addColorPrice();
    this.addRimPrice();
    this.addSpecialEquipmentPrice();
  }

  private addSpecialEquipmentPrice() {
    this.specialEquipments?.forEach(specialEquipment => {
      this.totalPrice += specialEquipment.price ?? 0;
    });
  }

  private addRimPrice() {
    const rimdataPrice = this.rimData?.price;
    if (rimdataPrice) {
      this.totalPrice += rimdataPrice

    }
  }

  private addColorPrice() {
    const colorPrice = this.colorData?.price;
    if (colorPrice) {
      this.totalPrice += colorPrice
    }
  }

  private addEnginePrice() {
    const enginePrice = this.engineData?.price;
    if (enginePrice) {
      this.totalPrice += enginePrice
    }
  }


  async onOrderConfirmClick() {

    let modalOrderConfirm:ModalOptions={
      modalType :"CONFIRM_ORDER",
      title:"Confirm order",
      message: 'Please confirm your order. Do you want to continue with the order?'
    }
    const confirmed = await this.carConfigOrderModal.open(modalOrderConfirm);
    if (confirmed) {
      await this.saveDeliveryToServer().then(orderId => this.showLinkOrderNumber(orderId)).catch(err => console.error(err));
    }
  }

  async showLinkOrderNumber(orderId: string) {
    let url = this.carConfigApiService.getApiOrderUrl() + "/" + orderId
    let modalOrderLink:ModalOptions={
      modalType :"CONFIRM_ORDER",
      title:"OrderLink to your order",
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
      carColorProductId: this.colorData?.productId,
      carEngineProductId: this.engineData?.productId,
      carRimsProductId: this.rimData?.productId,
      specialEquipmentProductIds: this.getSpecialEquipmentProductIds()
    };
  }

  private getSpecialEquipmentProductIds(): string[] {
    return this.specialEquipments?.map(eq => eq.productId).filter((id): id is string => !!id) ?? [];
  }

  showSpecialEquipment() {
    if (this.specialEquipments) {
      return this.specialEquipments[0].productId
    }
    return false;
  }

  receivedOrderLink() {
    const receivedOrderNumber = this.receivedOrderNumber;
    return receivedOrderNumber && receivedOrderNumber.length > 0;
  }

  canModifyOrderButtons() {
    return this.updateOrDeleteOrder && !this.createNewOrder;
  }

  canCreateNewOrder() {
    const correctUnlockedTab = this.carMenuTabs?.tabRim;
    if (correctUnlockedTab) {
      if (!this.receivedOrderLink() && !this.createNewOrder) {
        return true;
      }
    }
    return false;

  }

  showRearmOrderButton() {
    const correctUnlockedTab = this.carMenuTabs?.tabRim;
    if (correctUnlockedTab) {
      if (this.receivedOrderLink() && !this.createNewOrder) {
        return true;
      }
    }
    return false;
  }

  onRearmOrder() {
    this.receivedOrderNumber = "";
  }

  onModifyOrder() {
    // Navigating to the root allows the user to modify the configuration
    // while keeping the current state.
    this.router.navigateByUrl('/');
  }

  onDeleteOrder() {
    this.handleOrderDeletion();
  }

  private async handleOrderDeletion(): Promise<void> {
    let modalOption:ModalOptions={
      modalType :"Show_DELETE",
      title:'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.'
    }

    const confirmed = await this.carConfigOrderModal.open(modalOption);

    if (confirmed) {
      try {
        this.isSending = true;

        /*await firstValueFrom(
          this.orderControllerService.deleteOrder(this.receivedOrderNumber)
        );*/

        // On successful deletion, reset all application state and navigate.
        this.resetApplicationState();

      } catch (error) {
        console.error('Error deleting the order:', error);

        let modalCancelError:ModalOptions={
          modalType :"Show_DELETE",
          title:'Error',
          message: 'Could not delete the order. Please try again later.',
        }
        await this.carConfigOrderModal.open(modalCancelError);
      } finally {
        this.isSending = false;
      }
    }
  }

  private resetApplicationState(): void {

    this.carConfigChangedService.reset();
    this.carTabMenuChangeService.reset();
    this.onRearmOrder(); // Resets local component state
    this.router.navigateByUrl('/');
  }

  async onShareClick() {
    // Get the existing equipment IDs, ensuring it's always an array.
    const equipmentIds = this.getSpecialEquipmentProductIds();

    // Create a new array with a fixed length of 5, padding with a placeholder if needed.
    const paddedIds = Array.from({ length: 5 }, (_, i) => equipmentIds[i] || 'none');

    // Join the padded array to create the URL path segment.
    const specialEquipmentPath = paddedIds.join('/');

    const url: string = this.carConfigApiService.getApiProductUrl() + "/" +
      (this.engineData?.productId || 'none') + "/" +
      (this.colorData?.productId || 'none') + "/" +
      (this.rimData?.productId || 'none') + "/" +
      specialEquipmentPath;

    let modalOption: ModalOptions = {
      modalType: "SHOW_SHARE_LINK",
      title: "Shareable Link",
      message: url
    };
    await this.carConfigOrderModal.open(modalOption);
  }
}
