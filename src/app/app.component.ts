import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDatepicker, MatDialog } from '@angular/material';
import { CamapaignModel } from './common/models/campaign.model';
import { Constants } from './common/app.constants';
import { DashboardPopupComponent } from './dashboard-popup/dashboard-popup.component';

/***
 * This component is the root component which displays the header and list of campaigns.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /**
   * dummy data url
   */
  private _campaignDataURL = 'assets/dummyData.json';
  /**
   * types of campaigns
   */
  campaignTypes = ['Upcoming Campaigns', 'Live Campaigns', 'Past Campaigns'];
  /**
   * contains list of upcoming campaigns
   */
  upcoming_campaigns: Array<CamapaignModel> = [];
  /**
   * contains list of live campaigns
   */
  live_campaigns: Array<CamapaignModel> = [];
  /**
   * contains list of past campaigns
   */
  past_campaigns: Array<CamapaignModel> = [];
  /**
   * today's date
   */
  todayDate: Date = new Date();
  /**
   * global constants
   */
  gConst = Constants;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  /**
   * fetches data from a url
   */
  public getJSON(): Observable<any> {
    return this.http.get(this._campaignDataURL);
  }

  /**
   * When component initializes, fetch campaigns
   */
  ngOnInit() {
    this.fetchCampaigns();
  }

  /**
   * fetches campaigns data from dummy JSON, then
   * pass to data to get filtered so that it is divided into all tyes of campaigns.
   */
  fetchCampaigns() {
    this.getJSON().subscribe(data => {
      this.filterCampaigns(data.data);
    });
  }

  /**
   * Filter out campaigns based upon date and pushes into appropriate campaign-list.
   * @param data - list of campaigns
   */
  filterCampaigns(data: Array<CamapaignModel>) {
    this.past_campaigns = data.filter((ele) => this.getTimeDiff(this.todayDate, this.getTime(ele.createdOn)) < 0);
    this.live_campaigns = data.filter((ele) => this.getTimeDiff(this.todayDate, this.getTime(ele.createdOn)) == 0);
    this.upcoming_campaigns = data.filter((ele) => this.getTimeDiff(this.todayDate, this.getTime(ele.createdOn)) > 0);
    this.setTimeDiffAndCampaignType();
  }

  /**
   * calculate time-difference and type of campaign and then assign to relative campaignModel.
   */
  setTimeDiffAndCampaignType() {
    this.past_campaigns.forEach((ele) => {
      ele.timeDiff = this.getTimeDiff(this.todayDate, this.getTime(ele.createdOn));
      ele.type = Constants.CampaignType.past;
    });
    this.upcoming_campaigns.forEach((ele) => {
      ele.timeDiff = this.getTimeDiff(this.todayDate, this.getTime(ele.createdOn));
      ele.type = Constants.CampaignType.upcoming;
    });
  }

  /**
   * calculates time-difference in days between two dates.
   * @param date1 - first date
   * @param date2 - second date
   */
  getTimeDiff(date1: Date, date2: Date): number {
    let difference_In_Time = date2.getTime() - date1.getTime();
    return Math.ceil(difference_In_Time / (1000 * 3600 * 24));
  }

  /**
   * return date-object from timestamp
   * @param date - timestamp
   */
  getTime(date: Date) {
    return new Date(date);
  }

  /**
   * When campaign rescheduled, this method calculates the time-difference and
   * if required, deletes campaign from current list and pushes to appropriate one. 
   * @param campaigntype - contains type of campaign
   * @param index - inedx of campaign item in the list
   */
  updateCampaign(campaigntype: number, index: number) {
    if (campaigntype == Constants.CampaignType.upcoming) {
      let campaign = this.upcoming_campaigns[index];
      let updatedDate = this.upcoming_campaigns[index].createdOn;
      let timeDiff = this.getTimeDiff(this.todayDate, this.getTime(updatedDate));
      if (timeDiff <= 0) {
        this.pushIntoAppropriateCampaigns(campaign, timeDiff);
        this.upcoming_campaigns.splice(index, 1);
      } else {
        this.upcoming_campaigns[index].timeDiff = timeDiff;
      }
    } else if (campaigntype == Constants.CampaignType.past) {
      let campaign = this.past_campaigns[index];
      let updatedDate = campaign.createdOn;
      let timeDiff = this.getTimeDiff(this.todayDate, this.getTime(updatedDate));
      if (timeDiff >= 0) {
        this.pushIntoAppropriateCampaigns(campaign, timeDiff);
        this.past_campaigns.splice(index, 1);
      } else {
        this.past_campaigns[index].timeDiff = timeDiff;
      }
    } else {
      let campaign = this.live_campaigns[index];
      let updatedDate = campaign.createdOn;
      let timeDiff = this.getTimeDiff(this.todayDate, this.getTime(updatedDate));
      if (timeDiff != 0) {
        this.pushIntoAppropriateCampaigns(campaign, timeDiff);
        this.live_campaigns.splice(index, 1);
      } else {
        this.live_campaigns[index].timeDiff = timeDiff;
      }
    }
  }

  /**
   * pushes campaign into appropriate campaign-list according to time-difference.
   * @param campaign - campaign to be pushed  
   * @param timeDiff - updated calculated time-difference
   */
  pushIntoAppropriateCampaigns(campaign: CamapaignModel, timeDiff: number) {
    campaign.timeDiff = timeDiff;
    if (timeDiff > 0) {
      campaign.type = Constants.CampaignType.upcoming;
      this.upcoming_campaigns.push(campaign);
    } else if (timeDiff == 0) {
      campaign.type = Constants.CampaignType.live;
      this.live_campaigns.push(campaign);
    } else {
      campaign.type = Constants.CampaignType.past;
      this.past_campaigns.push(campaign);
    }
  }

  /**
   * opens-up popup for pricing details,
   * campaign data is send to the dialog.
   * @param campaign - contains campainModel of which information is to be displayed.
   */
  openDialog(campaign: CamapaignModel): void {
    const dialogRef = this.dialog.open(DashboardPopupComponent, {
      data: {campaign: campaign}
    });
  }

}
