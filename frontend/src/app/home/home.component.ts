import { Component, OnInit } from '@angular/core';
import { PatientService, Patient } from './../services/patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
        this.router.navigate(['/login']);
        return;
    }

    // this.patientService.getPatients().subscribe(patients => {
    //   this.patients = patients;
    // });
    this.fetchPatients();
  }
  fetchPatients(): void {
    this.patientService.getPatients().subscribe({
        next: (data) => this.patients = data,
        error: (err) => {
            if (err.status === 401) {
                this.router.navigate(['/login']);
            }
        }
    });
}



  navigateToDetails(id: number): void {
    this.router.navigate(['/details', id]);
  }
}
