import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CamapaignModel } from '../common/models/campaign.model';

@Component({
  selector: 'app-dashboard-popup',
  templateUrl: './dashboard-popup.component.html',
  styleUrls: ['./dashboard-popup.component.scss']
})
export class DashboardPopupComponent implements OnInit {

  pricings: Array<Array<string>> = [];
  campaign: CamapaignModel;

  constructor(
    public dialogRef: MatDialogRef<DashboardPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.campaign = this.data.campaign;
    this.parsePricingMap(this.campaign.price);
  }

  parsePricingMap(pricing){
    Object.keys(pricing).forEach((key) => {
      let arr = [];
      arr.push(key);
      arr.push(pricing[key]);
      this.pricings.push(arr);
    });
  }

  closeDialog() {
    if(this.dialogRef)
      this.dialogRef.close();
  }

}
