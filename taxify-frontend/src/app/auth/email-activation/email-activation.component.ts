import { PassengerService } from './../../services/passenger.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-activation',
  templateUrl: './email-activation.component.html',
  styleUrls: ['./email-activation.component.scss'],
})
export class EmailActivationComponent implements OnInit {
  constructor(
    private passengerService: PassengerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let token = this.activatedRoute.snapshot.paramMap.get('token');
    this.passengerService.activateEmail(token).subscribe({
      next: (resData) => {
        console.log(resData);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
}
