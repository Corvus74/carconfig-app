import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CarConfigChangeService} from '../../service/car-config-change.service';
import {
  CarColorDto,
  CarEngineDto,
  CarOrderUpdateDto,
  CarRimDto,
  OrderControllerService,
  SpecialEquipmentDto
} from '../../api';
import {firstValueFrom, Subscription} from 'rxjs';
import {CarConfigOrderModal} from './car-config-order-modal/car-config-order-modal';
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
export class CarConfigOrderComponent implements OnInit, OnDestroy {
  @Input() createNewOrder!: boolean;
  @Input() updateOrDeleteOrder!: boolean;
  @Input() showOrderMenu:boolean = false;
  engineData: CarEngineDto | undefined;
  colorData: CarColorDto | undefined;
  rimData: CarRimDto | undefined;
  specialEquipments: SpecialEquipmentDto[] | undefined;
  carMenuTabs: CarConfigMenuTabs | undefined;
  private carEngineSubscription: Subscription | undefined;
  private carColorSubscription: Subscription | undefined;
  private carRimSubscription: Subscription | undefined;
  private tabMenuSubscription: Subscription | undefined;

  private receivedOrderNumber: string | undefined;
  private carSpecialEquipmentsSubscription: Subscription | undefined;

  totalPrice = 0
  isSending: boolean = false;
  constructor(private readonly carConfigChangedService: CarConfigChangeService,
              private readonly orderControllerService: OrderControllerService,
              private readonly carConfigOrderModal: CarConfigOrderModal,
              private readonly carConfigGeneralFunctionsService: CarConfigGeneralFunctionsService,
              private readonly carTabMenuChangeService: CarTabMenuChangeService,
              private readonly carConfigApiService: CarConfigApiService,
              private readonly router:Router) {
  } // Dialog statt alter Modal-"Service"
  ngOnDestroy(): void {
    this.carEngineSubscription?.unsubscribe();
    this.carColorSubscription?.unsubscribe();
    this.carRimSubscription?.unsubscribe();
    this.carSpecialEquipmentsSubscription?.unsubscribe();
    this.tabMenuSubscription?.unsubscribe();

  }

  ngOnInit(): void {
    // Subscribe to the observable to get the latest data
    this.carEngineSubscription = this.carConfigChangedService.engineData$.subscribe(
      (data) => {
        this.engineData = data;
        this.calculatePriceComplete()
      }
    );
    this.carColorSubscription = this.carConfigChangedService.colorData$.subscribe(
      (data) => {
        this.colorData = data;
        this.calculatePriceComplete()
      }
    );

    this.carRimSubscription = this.carConfigChangedService.rimDataData$.subscribe(
      (data) => {
        this.rimData = data;
        this.calculatePriceComplete()
      }
    );
    this.carSpecialEquipmentsSubscription = this.carConfigChangedService.specialEquipmentData$.subscribe(
      (data) => {
        this.specialEquipments = data;
        this.calculatePriceComplete()
      }
    );
    this.tabMenuSubscription = this.carTabMenuChangeService.carConfigTabInfoData$.subscribe(
      (data) => {
        this.carMenuTabs = data;
        if(data?.showOrder){
          this.showOrderMenu = true;
        }
      }
    )
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
    const confirmed = await this.carConfigOrderModal.open("Confirm order",
      'Please confirm your order. Do you want to continue with the order?'
    );
    if (confirmed) {
      await this.saveDeliveryToServer().then(orderId => this.showLinkOrderNumber(orderId)).catch(err => console.error(err));
    }
  }

  async showLinkOrderNumber(orderId: string) {
    let url = this.carConfigApiService.getApiOrderUrl() + "/" + orderId
    await this.carConfigOrderModal.open("OrderLink to your order", url, true);
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
      if(!this.receivedOrderLink() && !this.createNewOrder){
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
    const confirmed = await this.carConfigOrderModal.open(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        this.isSending = true;
        // Assumes a `deleteOrder` method exists on your OrderControllerService.
        // You may need to adjust the method name based on your OpenAPI spec.
        /*await firstValueFrom(
          this.orderControllerService.deleteOrder(this.receivedOrderNumber)
        );*/

        // On successful deletion, reset all application state and navigate.
        this.resetApplicationState();

      } catch (error) {
        console.error('Error deleting the order:', error);
        await this.carConfigOrderModal.open('Error', 'Could not delete the order. Please try again later.', true);
      } finally {
        this.isSending = false;
      }
    }
  }

  private resetApplicationState(): void {
    // It's a best practice for stateful services to have a reset method.
    // You should add these methods to clear the configuration.
    this.carConfigChangedService.reset();
    this.carTabMenuChangeService.reset();
    this.onRearmOrder(); // Resets local component state
    this.router.navigateByUrl('/');
  }
}
