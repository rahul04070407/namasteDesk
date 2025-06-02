import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../service/contact.service';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})


export class ContactUsComponent implements OnInit {

  constructor(private ContactService: ContactService) { }
  isSubmitting = false;
  submitSuccess = false;
  shapes: { type: string, style: any, class: string }[] = [];
  mandatoryErrors: { [key: string]: boolean } = {};

  apiQuestions: any[] = [];
  formData: { [key: string]: any } = {};

  ngOnInit() {
    this.loadQuestions()
  }

  private loadQuestions() {
    this.ContactService.getAllActiveQuestions().subscribe({
      next: (response) => {
        if (response.status === 200 && response.data) {
          this.apiQuestions = response.data;
        }
      },
      error: (err) => console.error('API Error:', err)
    });
  }

  isFullWidth(question: any): boolean {
    return question.qsnType !== 'T';
  }

  onCheckboxChange(event: Event, questionName: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!this.formData[questionName]) {
      this.formData[questionName] = [];
    }

    if (input.checked) {
      this.formData[questionName].push(value);
    } else {
      this.formData[questionName] = this.formData[questionName].filter((v: string) => v !== value);
    }
  }

  onSubmit(form: any) {
    this.mandatoryErrors = {}; // Clear previous errors

    let hasError = false;

    // Check for mandatory questions
    this.apiQuestions.forEach((q: any) => {
      if (q.mandatory) { // spelling per your API (should be 'mandatory' ideally)
        const answer = this.formData['q' + q.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          this.mandatoryErrors['q' + q.id] = true;
          hasError = true;
        }
      }
    });

    if (hasError) {
      // alert('Please fill in all mandatory fields.');
      return;
    }
    const submissionData = this.apiQuestions.map(question => {
      const questionKey = `q${question.id}`;
      const answer = this.formData[questionKey];

      const submissionItem: any = {
        id: question.id,
        qsn: question.name,
      };
      if (question.qsnType === 'T') {
        submissionItem.ans = answer ? [answer] : [];
      }

      else if (question.qsnType === 'R' && !question.multipleChoose) {
        if (answer) {
          const selectedOption = question.optionLists.find((opt: any) => opt.name === answer);
          submissionItem.ans = [answer];
          if (selectedOption) {
            submissionItem.ansid = [selectedOption.id];
          }
        } else {
          submissionItem.ans = [];
        }
      }
      else if (question.qsnType === 'C' && question.multipleChoose) {
        const answers = Array.isArray(answer) ? answer : [];
        submissionItem.ans = answers;

        const ansIds: number[] = [];
        answers.forEach((ans: string) => {
          const option = question.optionLists.find((opt: any) => opt.name === ans);
          if (option) {
            ansIds.push(option.id);
          }
        });

        if (ansIds.length > 0) {
          submissionItem.ansid = ansIds;
        }
      }

      else {
        submissionItem.ans = answer ? [answer] : [];
      }

      return submissionItem;
    });

    this.isSubmitting = true;
    this.submitSuccess = false;
    console.log('Form Submitted:', submissionData);
    this.ContactService.addQuery(submissionData).subscribe({
      next: (response) => {
        this.submitSuccess = true;

        setTimeout(() => {
          this.submitSuccess = false;
          // this.ngOnInit()
        }, 2000);
        this.formData = {};
        this.isSubmitting = false
        form.resetForm();
        const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
        checkboxes.forEach(cb => cb.checked = false);

      },
      error: (error) => {
        // console.error('API Error:', error);
        this.isSubmitting = false
        alert('Something went wrong while submitting the form.');
      }
    });

  }


}
