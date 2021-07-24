import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import  *  as  airportListData  from  '../../../../../assets/data/airportsList.json';
import {CommonService} from '../../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-flight',
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.scss']
})
export class BookFlightComponent implements OnInit {

  public flightSearchForm: any=[];
  public airportList:any=[];
  isEnableReturnDate:boolean=false;

  constructor(private router:Router,private formBuilder: FormBuilder,private commonService:CommonService) {
  }

  ngOnInit(): void {
    this.setForm();
    this.fetchAirportData();
  }

  setForm() {
    this.flightSearchForm = this.formBuilder.group({
      tripType: ['', Validators.required],
      sourcePlace: ['', [Validators.required]],
      destinationPlace: ['', Validators.required],
      depatureDate: ['', Validators.required],
      returnDate: [''],
      sourcePlaceId:[],
      destinationPlaceId:[]
    })
    this.resetForm();
   

  }
  fetchAirportData(){
    //this.airportList = (airportListData as any).default
    this.commonService.getData("airportData").subscribe(res=>{
      this.airportList = res;
      this.commonService.setSessionValue('airportData',this.airportList);
     
    });
    console.log(this.airportList)

  }
  mapSrcDesId(data:any){
    data.forEach(element => {
      if(element.city==this.flightSearchForm.value.sourcePlace){
        this.flightSearchForm.value.sourcePlaceId = element.airportId;
      }
      if(element.city==this.flightSearchForm.value.destinationPlace){
        this.flightSearchForm.value.destinationPlaceId = element.airportId;
      }

    });
  }
  onSubmit(){
    debugger;
    console.log(this.flightSearchForm.value)
    this.isEnableReturnDate=this.flightSearchForm.value.tripType=2?true:false;
    let data = JSON.parse(this.commonService.getSessionValue('airportData') as any);
    this.mapSrcDesId(data);
    console.log(this.flightSearchForm)
    if(this.flightSearchForm.value && this.flightSearchForm.status=='VALID' ){
      this.commonService.setSearchFlightData(this.flightSearchForm.value);
      this.commonService.setSessionValue('searchFlights',this.flightSearchForm.value);
      this.router.navigate(['user/DashBoard/searchFlights']);
    // this.commonService.getSearchFlightData().subscribe((res)=>{
    //   console.log(res);
    // });
    }  
  }
  // ngOnDestroy(){
  //   this.router.navigate(['DashBoard/searchFlights']);
  // }
  ngOnChanges(){
    console.log("destroying child...")
  }
  changeTripType(event:any){
    console.log(event)
    this.isEnableReturnDate = event.target.value=2?true:false;
  }
  resetForm(){
    this.flightSearchForm.reset();
  }

}
