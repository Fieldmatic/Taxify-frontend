import { map } from 'rxjs';
import { FilterDriversService } from './services/filter-drivers.service';
import { Component, Input, OnInit } from '@angular/core';
import { Location } from 'src/app/maps/model/location';

export interface Task {
  name: string;
  completed: boolean;
  image: string;
}

@Component({
  selector: 'app-filter-drivers',
  templateUrl: './filter-drivers.component.html',
  styleUrls: ['./filter-drivers.component.scss'],
})
export class FilterDriversComponent implements OnInit {
  @Input() clientLocation: Location;

  checkboxPairs: number[] = [];
  petFriendly: boolean = false;
  babyFriendly: boolean = false;
  allComplete: boolean = false;

  vehicleTypes: Task[] = [];

  constructor(private filterDriversService: FilterDriversService) {}

  ngOnInit(): void {
    this.filterDriversService.getVehicleTypes().subscribe((types) => {
      for (let i = 0; i < types.length; i++) {
        let type = types.at(i);
        this.vehicleTypes.push({
          name: type,
          image: '../assets/' + type + '.png',
          completed: true,
        });
        if (i % 2 === 0) this.checkboxPairs.push(i);
      }
    });
  }

  updateAllVehicleTypesSelected() {
    this.allComplete =
      this.vehicleTypes != null && this.vehicleTypes.every((t) => t.completed);
  }

  markSomeVehicleTypes(): boolean {
    if (this.vehicleTypes == null) {
      return false;
    }
    return (
      this.vehicleTypes.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAllVehicleTypes(completed: boolean) {
    this.allComplete = completed;
    if (this.vehicleTypes == null) {
      return;
    }
    this.vehicleTypes.forEach((t) => (t.completed = completed));
  }

  continue() {
    console.log(this.babyFriendly);
    console.log(this.petFriendly);
    console.log(this.vehicleTypes);
  }
}
