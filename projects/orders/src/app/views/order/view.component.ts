import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CarConfig3dCarViewComponent,   CarInformationComponent} from '@carconfig/car-ui';
import {HeaderComponent} from '../../../../../shell/src/app/components/car-config-header/header.component';
import {CheckoutViewComponent} from '@carconfig/checkout';
import {
  OrderOverviewComponent
} from '../../components/car-config-order-overview/order-overview.component';
import {CarOrderDto, OrderControllerService, SpecialEquipmentDto} from  '@carconfig/api-client';
import {firstValueFrom} from 'rxjs';
import {CarConfigStoreService} from '@carconfig/car-state';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-car-config-view-order',
  imports: [
    CarConfig3dCarViewComponent,
    CarInformationComponent,
    HeaderComponent,
    CheckoutViewComponent,
    OrderOverviewComponent,
    TranslocoModule,
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit{
  orderId:  string |undefined |null = "";
  orderInfo: CarOrderDto = {};
  isLoading = false;

  constructor(private readonly route: ActivatedRoute, private readonly orderControllerService: OrderControllerService, private readonly carConfigChangeService: CarConfigStoreService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId= params.get('id')
    });

    this.loadOrder().then(text => {
      console.log(text);
      this.updateCarOrder();
    },err => {
      console.error("Could not load order: ", err);
    });
  }

  async loadOrder() {
    try {
      this.isLoading = true;
      if(this.orderId) {
        this.orderInfo = await firstValueFrom(
          this.orderControllerService.getOrderByOrderId(this.orderId)
        );
        return "OldOrder info loaded";
      }
      return "No OrderId given";
    } catch (error) {
      console.error("Error fetching Order", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
  updateCarOrder() {
      if (!this.orderInfo.carOrderId) return;

      const enginePos = this.orderInfo.carEngineOrder?.carEngine;
      if (enginePos) this.carConfigChangeService.updateEngine(enginePos);

      const colorPos = this.orderInfo.carColorOrder?.carColor;
      if (colorPos) this.carConfigChangeService.updateColor(colorPos);

      const rimPos = this.orderInfo.carRimOrder?.carRim;
      if (rimPos) this.carConfigChangeService.updateRims(rimPos);

      // Extract and filter optional equipment in one pass.
      const specialEquipmentList = this.orderInfo.specialEquipmentOrders
        ?.map(item => item.specialEquipment)
        .filter((item): item is SpecialEquipmentDto => !!item);

      if (specialEquipmentList?.length) {
        this.carConfigChangeService.updateSpecialEquipment(specialEquipmentList);
      }
    }
}
