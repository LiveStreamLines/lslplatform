import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor and ngIf
import { VideoService } from '../../services/video.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-generate-video',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './generate-video.component.html',
  styleUrls: ['./generate-video.component.scss'],
})
export class GenerateVideoComponent implements OnInit {
  @Input() cameraName!: string; // Receiving cameraName from pare
  @Input() previewPHoto!: string;

  showDate: boolean = false;
  showText: boolean = false;
  textOverlay: string = ''; // Text to display in the middle of the image
  showWatermark: boolean = false;
  //waterMarkText: string ='';
  showImage: boolean = false;
  imageFile: File | null = null;
  watermarkImageFile: File | null = null; // Store the uploaded watermark image
  addMusic: boolean = false; // Whether to include background music



  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private image = new Image(); // To load and draw the image on the canvas
  private logoimage = new Image();
  extractedDate: string = ''; // Date extracted from the image URL


  projectTag!: string;
  developerTag!: string;

  startDate!: Date;
  endDate!: Date;
  hour1: number = 8;
  hour2: number = 9;
  
  resolution: string = '720';
  duration: number = 60;

  durationOptions = [
    { label: '30 seconds', value: 30 },
    { label: '1 minute', value: 60 },
    { label: '1:30 minutes', value: 90 },
    { label: '2 minutes', value: 120 },
    { label: '2:30 minutes', value: 150 },
    { label: '3 minutes', value: 180 },
  ];

  brightness: number = 0; // Default brightness
  contrast: number = 1;   // Default contrast
  saturation: number = 1; // Default saturation

  videoSrc: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  filterMessage: string | null = null;
  filteredPicsCount!: number;
  isFilterComplete: boolean = false;

  constructor(private videoService: VideoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
    this.projectTag = this.route.snapshot.paramMap.get('projectTag')!;

    // Simulate fetching a preview image
    this.loadImage();
  }

   // Extract the date from the image URL
   private extractDateFromUrl(url: string): string {
    const match = url.match(/\/large\/(\d{14})\.jpg$/);
    if (match && match[1]) {
      const year = match[1].slice(0, 4);
      const month = match[1].slice(4, 6);
      const day = match[1].slice(6, 8);
      return `${year}-${month}-${day}`;
    }
    return '';
  }

   // Load the image and redraw it with text
  private loadImage(): void {
    if (!this.previewPHoto) return;

    this.extractedDate = this.extractDateFromUrl(this.previewPHoto);
    this.image.src = this.previewPHoto;
      this.image.onload = () => {
      this.drawCanvas();
    };
  }

  private drawDate(context: CanvasRenderingContext2D, fontSize: number): void {
    if (this.showDate && this.extractedDate) {
      context.font = `${fontSize}px Arial`; // Set font style and size
      context.textAlign = 'left'; // Align text to the left
      context.fillStyle = 'white'; // Text color  
      // Measure the text width
      const textMetrics = context.measureText(this.extractedDate);
      const textWidth = textMetrics.width;
      const textHeight = fontSize; // Approximate text height using the font size  
      // Position of the text
      const x = 10; // Margin from the left
      const y = fontSize + 10; // Margin from the top
  
      // Draw a semi-transparent rectangle behind the text
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Black with 50% transparency
      context.fillRect(x - 5, y - textHeight, textWidth + 10, textHeight + 5);
  
      // Draw the text on top of the rectangle
      context.fillStyle = 'white'; // Reset text color
      context.fillText(this.extractedDate, x, y);
    }
  }
  
  private drawTextOverlay(context: CanvasRenderingContext2D, canvasWidth: number, fontSize: number): void {
    if (this.showText && this.textOverlay) {
      context.font = `${fontSize}px Arial`; // Set font style and size
      context.textAlign = 'center'; // Center align text
      context.fillStyle = 'white'; // Text color
  
      // Measure the text width
      const textMetrics = context.measureText(this.textOverlay);
      const textWidth = textMetrics.width;
      const textHeight = fontSize; // Approximate text height using the font size
  
      // Position of the text
      const x = canvasWidth / 2; // Center of the canvas
      const y = fontSize * 2; // Position slightly below the top (adjust as needed)
  
      // Draw a semi-transparent rectangle behind the text
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Black with 50% transparency
      context.fillRect(x - textWidth / 2 - 5, y - textHeight, textWidth + 10, textHeight + 5);
  
      // Draw the text on top of the rectangle
      context.fillStyle = 'white'; // Reset text color
      context.fillText(this.textOverlay, x, y);
    }
  }
  
  private drawWatermark(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    if (this.showWatermark && this.watermarkImageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const watermarkImage = new Image();
        watermarkImage.src = reader.result as string;
        watermarkImage.onload = () => {
          const x = (canvasWidth - watermarkImage.width) / 2; // Center horizontally
          const y = (canvasHeight - watermarkImage.height) / 2; // Center vertically
          context.globalAlpha = 0.5; // Make the watermark semi-transparent
          context.drawImage(watermarkImage, x, y);
          context.globalAlpha = 1.0; // Reset transparency
        };
      };
      reader.readAsDataURL(this.watermarkImageFile);
    }   
  }

  private drawUploadedImage(context: CanvasRenderingContext2D, canvasWidth: number): void {
    if (this.imageFile) {
      const squareSize = 200; // Size of the small square
      const x = canvasWidth - squareSize - 10; // 10px margin from the right edge
      const y = 10; // 10px margin from the top edge
  
      // Draw the uploaded image
      context.drawImage(this.logoimage, x, y, squareSize, squareSize);
    }
  }
  
  
  private drawCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Canvas context could not be retrieved');
      return;
    }
    // Set canvas size based on the image
    canvas.width = this.image.width;
    canvas.height = this.image.height;
  
    // Draw the image
    context.drawImage(this.image, 0, 0, canvas.width, canvas.height);
  
    // Common font size for overlays
    const fontSize = 60;
    context.font = `${fontSize}px Arial`;
    context.fillStyle = 'white';
  
    // Call modular drawing methods
    this.drawDate(context, fontSize);
    this.drawTextOverlay(context, canvas.width, fontSize);
    this.drawWatermark(context, canvas.width, canvas.height);
    this.drawUploadedImage(context, canvas.width);

  }

   // Adjust hour2 when hour1 changes
   onHour1Change(newHour: number): void {
    this.hour1 = newHour;
    this.adjustEndHour(); // Ensure hour2 respects the new hour1
  }

  adjustEndHour(): void {
     this.hour2 = this.hour1 + 1;
  }

  onShowDateChange(): void {
    console.log('Show Date toggled:', this.showDate);
    this.drawCanvas(); // Trigger canvas redraw
  }

  onShowTextChange(): void {
    if (!this.showText) {
      this.textOverlay = '';
    }
  }

  onTextOverlayChange(): void {
    this.drawCanvas(); // Redraw the canvas to update the text overlay
  }

  onShowWatermarkChange(): void {
    if (!this.showWatermark) {
      this.watermarkImageFile = null;
    }
  }

  onWatermarkChange(): void {
    this.drawCanvas(); // Redraw the canvas to update the watermark text
  }


  onShowImageChange(): void {
    if (!this.showImage) {
      this.imageFile = null;
    }
  }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.imageFile = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const uploadedImage = new Image();
        uploadedImage.src = reader.result as string;
        uploadedImage.onload = () => {
          this.logoimage = uploadedImage; // Store the uploaded image
          this.drawCanvas(); // Redraw the canvas to include the uploaded image
        };
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onWatermarkImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.watermarkImageFile = target.files[0]; // Store the selected file
      this.drawCanvas(); // Redraw the preview with the watermark image
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}${month}${day}`;
  }

  onEffectChange(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
  
    if (!context) {
      console.error('Canvas context could not be retrieved');
      return;
    }
  
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Apply filters
    const adjustedBrightness = this.brightness + 1; // Now ranges from 0 (darkest) to 2 (brightest)
    context.filter = `brightness(${adjustedBrightness}) contrast(${this.contrast}) saturate(${this.saturation})`;

    // Draw the image with filters
    context.drawImage(this.image, 0, 0, canvas.width, canvas.height);

    // Reset filter for overlays
    context.filter = 'none';

    // Redraw overlays
    this.drawDate(context, 60);
    this.drawTextOverlay(context, canvas.width, 60);
    this.drawWatermark(context, canvas.width, canvas.height);
    this.drawUploadedImage(context, canvas.width);
  }

  filterImages() {
    this.isLoading = true;
    this.errorMessage = null;
    this.filterMessage = null;

    const formData = new FormData();
      formData.append('developerId', this.developerTag);
      formData.append('projectId', this.projectTag);
      formData.append('cameraId', this.cameraName);
      formData.append('date1', this.formatDate(this.startDate));
      formData.append('date2', this.formatDate(this.endDate));
      formData.append('hour1', this.hour1.toString().padStart(2, '0'));
      formData.append('hour2', this.hour2.toString().padStart(2, '0'));
      formData.append('duration', this.duration.toString());
      formData.append('showdate', this.showDate ? 'true' : 'false');
      formData.append('showedText', this.showText ? this.textOverlay : '');
      formData.append('resolution', this.resolution || '720');
      formData.append('music', this.addMusic ? 'true' : 'false');
      
      // Add visual effect parameters
      formData.append('contrast', this.contrast.toString());
      formData.append('brightness', this.brightness.toString());
      formData.append('saturation', this.saturation.toString());
  
    if (this.imageFile) {
      formData.append('logo', this.imageFile); // Append the file to the FormData
    }

    if (this.watermarkImageFile) {
      formData.append('showedWatermark', this.watermarkImageFile);
    }

    this.videoService.generateVideo(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.filterMessage = response.message; // Message from the backend (e.g., "Pictures filtered successfully")
        this.filteredPicsCount = response.filteredImageCount;
        this.isFilterComplete = true; // Enable video generation
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to filter images. Please try again.';
        console.error(error);
      },
    });
  } 

  preventManualInput(event: KeyboardEvent): void {
    // Allow only arrow keys, tab, backspace, and delete
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'Tab', 'Backspace', 'Delete'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
