import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService, Patient } from './../services/patient.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  patient: Patient = {
    id: 0,
    numero_identite: '',
    nom: '',
    prenom: '',
    date_naissance: new Date(),
    sex: '',
    numero_telephone: ''
  };

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    console.log('Patient ID:', id);
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        console.log('Patient data:', data);
        this.patient = data;
      },
      error: (err) => console.error(err)
    });
  }
  

  updatePatient(): void {
    this.patientService.updatePatient(this.patient).subscribe({
      next: () => {
        alert('Patient modifié avec succès');
        this.router.navigate(['/details', this.patient.id]);
      },
      error: (err) => console.error(err)
    });
  }
}
