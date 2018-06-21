export class EbayItem {
  public itemId: string;
  public title: string;
  public galleryURL: string;
  public ebayPage: string;
  public location: string;
  public shippingCost: number;
  public shippingCurrency: string;
  public shipToLocations: string;
  public priceCost: number;
  public priceCurrency: string;
  public condition: string;
  public isTopRated: boolean;

  constructor(jsonData) {
    if (jsonData['itemId']) {
      this.itemId = jsonData['itemId'][0];
    }

    if (jsonData['title']) {
      this.title = jsonData['title'][0];
    }
    if (jsonData['galleryURL']) {
        this.galleryURL = jsonData['galleryURL'][0];
    }
    if (jsonData['viewItemURL']) {
      this.ebayPage = jsonData['viewItemURL'][0];
    }

    if (jsonData['location']) {
      this.location = jsonData['location'][0];
    }

    if (jsonData['shippingInfo']) {
      this.shipToLocations = jsonData['shippingInfo'][0]['shipToLocations'][0];
      if (jsonData['shippingInfo'][0]['shippingServiceCost']) {
        this.shippingCost = +jsonData['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
        this.shippingCurrency = jsonData['shippingInfo'][0]['shippingServiceCost'][0]['@currencyId'];
      } else {
        this.shippingCost = undefined;
        this.shippingCurrency = undefined;
      }
    }

    if (jsonData['sellingStatus']) {
      this.priceCost = +jsonData['sellingStatus'][0]['currentPrice'][0]['__value__'];
    }

    if (jsonData['sellingStatus']) {
      this.priceCurrency = jsonData['sellingStatus'][0]['currentPrice'][0]['@currencyId'];
    }
    if (jsonData['condition']) {
      this.condition = jsonData['condition'][0]['conditionDisplayName'][0];
    }
    if (jsonData['topRatedListing']) {
      this.isTopRated = jsonData['topRatedListing'][0] === 'true';
    }

  }
}
