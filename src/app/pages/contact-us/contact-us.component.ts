import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../service/contact.service';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})


export class ContactUsComponent implements OnInit {

  constructor(private ContactService: ContactService) {

  }
  isSubmitting = false;
  submitSuccess = false;
  shapes: { type: string, style: any, class: string }[] = [];
  mandatoryErrors: { [key: string]: boolean } = {};
  ngOnInit() {

    this.loadQuestions()

    const totalShapes = window.innerWidth < 768 ? 10 : 20;

    for (let i = 0; i < totalShapes; i++) {
      const shapeType = this.getRandomShapeType();
      this.shapes.push({
        type: shapeType,
        class: this.getShapeClass(shapeType),
        style: this.getShapeStyle(shapeType),
      });
    }
  }

  apiQuestions: any[] = [];
  formData: { [key: string]: any } = {};
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


  private getRandomShapeType(): string {
    const types = [
      'circle',
      'semi-circle',
      'triangle',
      'half-triangle',
      'curved-triangle',
      'kite',
      'hexagon',
      'half-hexagon'
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getShapeClass(type: string): string {
    switch (type) {
      case 'circle': return 'circle';
      case 'semi-circle': return 'circle half';
      case 'triangle': return 'triangle';
      case 'half-triangle': return 'triangle half';
      case 'curved-triangle': return 'triangle curved';
      case 'kite': return 'kite';
      case 'hexagon': return 'hexagon';
      case 'half-hexagon': return 'hexagon half';
      default: return '';
    }
  }



  private getShapeStyle(type: string): any {
    const top = `${Math.random() * 90}%`;
    const left = `${Math.random() * 90}%`;
    const rotation = `rotate(${Math.random() * 360}deg)`;
    const opacity = 0.15;

    const colors = [
      '#e53935', // cherry red
      '#1e88e5', // blue
      '#fb8c00', // orange
      '#43a047', // green
      '#8e24aa', // purple
      '#5e35b1', // violet
      '#d81b60', // deep pink / cherry
      '#00acc1', // teal
      '#fdd835', // yellow
      '#3949ab', // indigo
    ];


    const background = colors[Math.floor(Math.random() * colors.length)];

    if (type === 'circle' || type === 'semi-circle') {
      const size = 70 + Math.random() * 80;
      return {
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        transform: rotation,
        borderRadius: type === 'circle' ? '50%' : '0',
        background,
        clipPath: type === 'semi-circle' ? 'ellipse(50% 50% at 50% 100%)' : 'none'
      };
    }

    if (type === 'triangle') {
      const size = 80 + Math.random() * 80;
      const half = size / 2;
      return {
        top,
        left,
        width: '0',
        height: '0',
        opacity,
        transform: rotation,
        borderLeft: `${half}px solid transparent`,
        borderRight: `${half}px solid transparent`,
        borderBottom: `${size}px solid ${background}`,
      };
    }

    if (type === 'curved-triangle') {
      const size = 60 + Math.random() * 60;
      return {
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        transform: rotation,
        background,
        clipPath: 'path("M 0 100 Q 50 0, 100 100 Z")',
      };
    }

    if (type === 'kite') {
      const size = 60 + Math.random() * 60;
      return {
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        transform: rotation,
        background,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      };
    }

    if (type === 'hexagon' || type === 'half-hexagon') {
      const width = 40 + Math.random() * 40;
      const height = width * 0.55;
      return {
        top,
        left,
        width: `${width}px`,
        height: `${height}px`,
        opacity,
        transform: rotation,
        background,
        clipPath: type === 'hexagon'
          ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
          : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)',
      };
    }

    return {};
  }

}
