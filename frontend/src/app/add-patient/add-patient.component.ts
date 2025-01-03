import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient, PatientService } from './../services/patient.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent {
  patientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService, 
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      numero_identite: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      date_naissance : ['', Validators.required],
      sex : ['', Validators.required],
      numero_telephone: ['', Validators.required,Validators.maxLength(8)]
    });
  }

  addPatient(): void {
    if (this.patientForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Get the raw form values
    const formValues = this.patientForm.getRawValue();
    
    // Create the patient object with proper type conversions
    const patient: Patient = {
      numero_identite: formValues.numero_identite.toString(), // Convert number to string
      nom: formValues.nom,
      prenom: formValues.prenom,
      date_naissance: formValues.date_naissance,
      sex: formValues.sex,
      numero_telephone: formValues.numero_telephone.toString() // Convert number to string
    };
  
    console.log('Data sent to API:', patient);
    this.patientService.addPatient(patient).subscribe({
      next: (response) => {
        console.log('Patient added successfully:', response);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Une erreur est survenue lors de l\'ajout du patient.');
      }
    });
  }
}
