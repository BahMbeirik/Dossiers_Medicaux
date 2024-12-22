import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService, Patient } from './../services/patient.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patient!: Patient;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.patientService.getPatientById(id).subscribe({
      next: (data) => this.patient = data,
      error: (err) => console.error(err)
    });
  }

  deletePatient(): void {
    this.patientService.deletePatient(this.patient.id!).subscribe(() => {
      alert('Patient supprimé avec succès');
      this.router.navigate(['/home']);
    });
  }
  

  editPatient(): void {
    this.router.navigate(['/edit', this.patient.id]);
  }
}
