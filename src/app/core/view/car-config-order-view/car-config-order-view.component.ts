import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CarConfig3dCarViewComponent} from '../../components/car-config-3d-car-view/car-config-3d-car-view.component';
import {
  CarConfigCarInformationComponent
} from '../../components/car-config-car-information/car-config-car-information.component';
import {CarConfigHeaderComponent} from '../../components/car-config-header/car-config-header.component';
import {CarConfigOrderComponent} from '../../components/car-config-order/car-config-order.component';
import {
  CarConfigOrderOverviewComponent
} from '../../components/car-config-order-overview/car-config-order-overview.component';
import {CarOrderDto, OrderControllerService, SpecialEquipmentDto} from '../../api';
import {firstValueFrom} from 'rxjs';
import {CarConfigStoreService} from '../../service/car-config-store.service';

@Component({
  selector: 'app-car-config-view-order',
  imports: [
    CarConfig3dCarViewComponent,
    CarConfigCarInformationComponent,
    CarConfigHeaderComponent,
    CarConfigOrderComponent,
    CarConfigOrderOverviewComponent
  ],
  templateUrl: './car-config-order-view.component.html',
  styleUrl: './car-config-order-view.component.scss'
})
export class CarConfigOrderViewComponent implements OnInit{
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
    if (this.orderInfo.carOrderId) {
      const enginePos = this.orderInfo.carEngineOrder?.carEngine;
      if (enginePos) {
        this.carConfigChangeService.updateEngine(enginePos);
      }
      const colorPos = this.orderInfo.carColorOrder?.carColor;
      if (colorPos) {
        this.carConfigChangeService.updateColor(colorPos);
      }
      const rimPos = this.orderInfo.carRimOrder?.carRim;
      if (rimPos) {
        this.carConfigChangeService.updateRims(rimPos);
      }
      const specialEquipmentOrders = this.orderInfo.specialEquipmentOrders;
      let specialEquipmentList: SpecialEquipmentDto[] | undefined = [];
      if (specialEquipmentOrders) {
        for (let specialEquipmentElem of specialEquipmentOrders) {
          if (specialEquipmentElem.specialEquipment) {
            specialEquipmentList.push(specialEquipmentElem.specialEquipment)
          }
        }
        this.carConfigChangeService.updateSpecialEquipment(specialEquipmentList)


      }
    }
  }
}
