import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../../../../shell/src/app/components/car-config-header/header.component';
import {CarConfig3dCarViewComponent} from '@carconfig/car-ui';
import {
  CarInformationComponent
} from '@carconfig/car-ui';
import {CheckoutViewComponent} from '@carconfig/checkout';
import {ActivatedRoute} from '@angular/router';
import {
  ProductInfoDetailDto,
  ProductInfoDto,
  ProductInfoWebControllerService,
  SpecialEquipmentDto
} from '@carconfig/api-client';
import {firstValueFrom} from 'rxjs';
import {CarConfigStoreService} from '@carconfig/car-state';

@Component({
  selector: 'app-car-config-overview-view',
  imports: [
    HeaderComponent,
    CarConfig3dCarViewComponent,
    CarInformationComponent,
    CheckoutViewComponent
  ],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss'
})
export class ProductViewComponent implements OnInit {
  productInfoDto: ProductInfoDto = {};
  productInfoDetailDto!: ProductInfoDetailDto;
  orderId: string | null = null;
  private isLoading: boolean = false;

  constructor(private readonly route: ActivatedRoute, private readonly orderControllerService: ProductInfoWebControllerService, private readonly carConfigStoreService: CarConfigStoreService) {
  }

  ngOnInit(): void {
     this.buildProductInfoFromParams()

    if (this.productInfoDto) {
      this.loadOrder().then(text => {
        console.log(text);
        this.updateCarOrder();
      }, err => {
        console.error("Could not load order: ", err);
      });
    } else {
      this.buildProductInfoFromParams();
    }
  }

  private buildProductInfoFromParams(): void {
    this.route.paramMap.subscribe(params => {
      // A more scalable way to collect special equipment IDs from route parameters.
      const specialEquipmentIds = [
        params.get('specialEquipmentIdOne'),
        params.get('specialEquipmentIdTwo'),
        params.get('specialEquipmentIdThree'),
        params.get('specialEquipmentIdFour'),
        params.get('specialEquipmentIdFive')
      ].filter((id): id is string => !!id); // Filter out any null or empty values.

      // Populate the productInfoDto object directly from the route parameters.
      this.productInfoDto = {
        carEngineProductId: params.get('engineId') ?? undefined,
        carColorProductId: params.get('colorId') ?? undefined,
        carRimsProductId: params.get('rimId') ?? undefined,
        specialEquipmentProductIds: specialEquipmentIds
      };
    });
  }

  async loadOrder() {
    try {
      this.isLoading = true;
      if (this.productInfoDto) {
        this.productInfoDetailDto = await firstValueFrom(
          this.orderControllerService.getAllProductByProductIds(this.productInfoDto)
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
    if (this.productInfoDto) {
      const enginePos = this.productInfoDetailDto.carEngine;
      if (enginePos) {
        this.carConfigStoreService.updateEngine(enginePos);
      }
      const colorPos = this.productInfoDetailDto.carColor;
      if (colorPos) {
        this.carConfigStoreService.updateColor(colorPos);
      }
      const rimPos = this.productInfoDetailDto.carRim;
      if (rimPos) {
        this.carConfigStoreService.updateRims(rimPos);
      }
      const specialEquipmentOrders = this.productInfoDetailDto.specialEquipment;
      let specialEquipmentList: SpecialEquipmentDto[] | undefined = [];
      if (specialEquipmentOrders) {
        for (let specialEquipmentElem of specialEquipmentOrders) {
          specialEquipmentList.push(specialEquipmentElem);
        }
        this.carConfigStoreService.updateSpecialEquipment(specialEquipmentList);
      }
    }
  }
}
