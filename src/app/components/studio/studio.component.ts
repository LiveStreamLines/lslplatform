import { Component, ElementRef, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css'
})
export class StudioComponent {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() imageSrc!: string; // Parent-provided image source

  private context!: CanvasRenderingContext2D;
  image = new Image(); // To load the provided image
  private rect!: DOMRect; // Canvas rect for scaling
  private scaleX!: number; // Horizontal scale
  private scaleY!: number; // Vertical scale

  fontSize: number = 60;
  fontColor: string = '#000000';
  textValue: string = ''; // Current text being added
  textPosition: { x: number; y: number } | null = null; // Position of the text

  texts: { x: number; y: number; text: string; fontSize: number; color: string; selected: boolean }[] = [];
  selectedTextIndex: number | null = null; // Index of the selected text
  fontControllerPosition: { x: number; y: number } | null = null;

  shapes: {
    type: 'rectangle' | 'circle';
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    selected: boolean;
  }[] = [];
  selectedShapeIndex: number | null = null; // Index of the selected shape
  
  private isDragging: boolean = false;
  private hasDragged: boolean = false;

  currentTool: string = ''; // Stores the current tool (text, rectangle, etc.)

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.context = canvas.getContext('2d')!;
    canvas.width = 800; // Default canvas size
    canvas.height = 600;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageSrc'] && this.imageSrc) {
      this.loadImage();
    }
  }

  selectTool(tool: string): void {
    this.currentTool = tool;
    console.log(`Selected Tool: ${tool}`);
  }

  private loadImage(): void {
    this.image.src = this.imageSrc;
    this.image.onload = () => {
      const canvas = this.canvasRef.nativeElement;
      const context = this.context;

      // Resize canvas to match the image
      canvas.width = this.image.width;
      canvas.height = this.image.height;

      // Update rect and scale factors
      this.rect = canvas.getBoundingClientRect();
      this.scaleX = canvas.width / this.rect.width;
      this.scaleY = canvas.height / this.rect.height;

      // Draw the image on the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(this.image, 0, 0);
    };
  }

  private updateCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = this.context;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the image
    context.drawImage(this.image, 0, 0);


    // Draw shapes
    this.shapes.forEach((shape, index) => {
      context.beginPath();
      context.fillStyle = shape.color;

      if (shape.type === 'rectangle') {
        context.rect(shape.x, shape.y, shape.width, shape.height);
        context.fill();
      } else if (shape.type === 'circle') {
        const radius = Math.sqrt(Math.pow(shape.width, 2) + Math.pow(shape.height, 2));
        context.arc(shape.x, shape.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.closePath();

      // Draw border for selected shape
      if (index === this.selectedShapeIndex) {
        context.strokeStyle = 'blue';
        context.lineWidth = 2;

        if (shape.type === 'rectangle') {
          context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'circle') {
          const radius = Math.sqrt(Math.pow(shape.width, 2) + Math.pow(shape.height, 2));
          context.beginPath();
          context.arc(shape.x, shape.y, radius, 0, Math.PI * 2);
          context.stroke();
          context.closePath();
        }
      }
    });


  
    this.texts.forEach((t, index) => {
      context.font = `${t.fontSize}px Arial`;
      context.fillStyle = t.color;
      context.fillText(t.text, t.x, t.y);
  
      if (index === this.selectedTextIndex) {
        // Draw a bounding box around the selected text
        const textWidth = context.measureText(t.text).width;
        const textHeight = t.fontSize; // Approximate text height
        context.strokeStyle = 'blue';
        context.lineWidth = 2;
        context.strokeRect(t.x - 5, t.y - textHeight, textWidth + 10, textHeight + 10);
      }
    });
  }


  onCanvasClick(event: MouseEvent): void {
    if (this.hasDragged) {
      this.hasDragged = false; // Reset the flag
      return; // Skip adding text
    }
    const { x, y } = this.getCanvasCoordinates(event);

    console.log('Click position:', { x, y });

    // Check if there's a selected text
    if (this.selectedTextIndex !== null) {
      const selectedText = this.texts[this.selectedTextIndex];
      if (!this.isPointInsideText(selectedText, x, y)) {
        // Deselect the text if clicked outside
        this.selectedTextIndex = null;
        this.fontControllerPosition = null;
        this.updateCanvas();
        return; // Stop further processing
      }
    }

    // Handle shapes
      if (this.currentTool === 'rectangle' || this.currentTool === 'circle') {
        const clickedShapeIndex = this.shapes.findIndex((shape) =>
          this.isPointInsideShape(shape, x, y)
        );

        if (clickedShapeIndex !== -1) {
          this.selectShape(clickedShapeIndex); // Select the clicked shape
        } else {
          this.deselectShape(); // Deselect previously selected shape
        }

        this.updateCanvas();
        return; // Stop further processing for shapes
      }

  
    if (this.currentTool === 'text') {
      //Check if a text is clicked
      const clickedTextIndex = this.texts.findIndex((t) => this.isPointInsideText(t, x, y));
      if (clickedTextIndex !== -1) {
        this.selectText(clickedTextIndex); // Select existing text
      } else {
        // Add a new text
        this.texts.push({ x, y, text: 'New Text', fontSize: 40, color: '#000000', selected: true });
        this.selectedTextIndex = this.texts.length - 1;
        this.selectText(this.selectedTextIndex); // Select existing text
      }
      
      this.updateCanvas();
    }
  }

 
   private isPointInsideText(text: { x: number; y: number; text: string; fontSize: number }, x: number, y: number): boolean {
    const context = this.context;
  
    // Calculate the width and height of the text
    context.font = `${text.fontSize}px Arial`; // Match the font size
    const textWidth = context.measureText(text.text).width;
    const textHeight = text.fontSize; // Approximate height based on font size
  
    // Define the bounding box of the text
    const left = text.x;
    const right = text.x + textWidth;
    const top = text.y - textHeight; // Text's top edge (y is baseline)
    const bottom = text.y;
  
    // Check if the point is inside the bounding box
    return x >= left && x <= right && y >= top && y <= bottom;
  }
  

   private selectText(index: number): void {
    this.selectedTextIndex = index;
    this.texts.forEach((t, i) => (t.selected = i === index)); // Mark selected text
    const selectedText = this.texts[index];
    this.fontSize = selectedText.fontSize;
    this.fontColor = selectedText.color;
    this.textValue = selectedText.text;

    // Get canvas bounding rect and scale
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

     // Calculate accurate font controller position
   const textHeight = selectedText.fontSize; // Approximate height using font size

   // Calculate the controller position relative to the canvas
    const controllerX = (selectedText.x / scaleX); // Center horizontally
    const controllerY = (selectedText.y / scaleY); // Slightly below the text

    
   this.fontControllerPosition = {
      x: controllerX, // Align with text's x position
      y: controllerY + textHeight + 10 // Offset slightly below the text
    };
    console.log('Font Controller Position:', this.fontControllerPosition);

  }
    

   updateText(): void {
    if (this.selectedTextIndex !== null) {
      const selectedText = this.texts[this.selectedTextIndex];
      selectedText.fontSize = this.fontSize; // Update font size
      selectedText.color = this.fontColor;  // Update font color
      selectedText.text = this.textValue;
      this.updateCanvas();
    }
   }

   removeText(): void {
    if (this.selectedTextIndex !== null) {
      // Remove the selected text from the array
      this.texts.splice(this.selectedTextIndex, 1);
  
      // Reset selection and controller position
      this.selectedTextIndex = null;
      this.fontControllerPosition = null;
  
      // Redraw the canvas
      this.updateCanvas();
    }
   }

  private isPointInsideShape(
      shape: { type: string; x: number; y: number; width: number; height: number },
      x: number,
      y: number
    ): boolean {
      if (shape.type === 'rectangle') {
        return (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
        );
      } else if (shape.type === 'circle') {
        const radius = Math.sqrt(
          Math.pow(shape.width, 2) + Math.pow(shape.height, 2)
        );
        const dx = x - shape.x;
        const dy = y - shape.y;
        return Math.sqrt(dx * dx + dy * dy) <= radius;
      }
      return false;
  }

  private selectShape(index: number): void {
    this.selectedShapeIndex = index;
    this.shapes.forEach((shape, i) => (shape.selected = i === index));
  }

  private deselectShape(): void {
    this.selectedShapeIndex = null;
    this.updateCanvas();
  }

  
   onCanvasMouseDown(event: MouseEvent): void {
    const { x, y } = this.getCanvasCoordinates(event);


    if (this.selectedTextIndex !== null) {
      const selectedText = this.texts[this.selectedTextIndex];
      if (this.isPointInsideText(selectedText, x, y)) {
        this.isDragging = true;
        return; // Stop further processing if dragging a text
      }
    }

    if (this.currentTool === 'rectangle' || this.currentTool === 'circle') {
      // Check if a shape is clicked
      const clickedShapeIndex = this.shapes.findIndex((shape) =>
        this.isPointInsideShape(shape, x, y)
      );

      if (clickedShapeIndex !== -1) {
        // Select the clicked shape for dragging
        this.selectShape(clickedShapeIndex);
        this.isDragging = true;
      } else {
        // Create a new shape
        this.isDragging = true;
        this.shapes.push({
          type: this.currentTool,
          x,
          y,
          width: 0,
          height: 0,
          color: '#000000',
          selected: false,
        });
        this.selectedShapeIndex = this.shapes.length - 1; // Select the new shape
      }
    }
  }
  
  onCanvasMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    const { x, y } = this.getCanvasCoordinates(event);
  
    // Handle moving text
    if (this.currentTool === 'text' && this.selectedTextIndex !== null) {
      this.hasDragged = true;

      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) * this.scaleX;
      const y = (event.clientY - rect.top) * this.scaleY;
  
      const selectedText = this.texts[this.selectedTextIndex];
      selectedText.x = x;
      selectedText.y = y;
  
      // Update the font controller position
      this.fontControllerPosition = {
        x: event.clientX - rect.left + 10, // Offset slightly to the right
        y: event.clientY - rect.top + selectedText.fontSize / 2 + 10, // Offset slightly below
      };
    }
  
    // Handle drawing or resizing shapes
    else if (
      (this.currentTool === 'rectangle' || this.currentTool === 'circle') &&
      this.shapes.length > 0
    ) {
      const currentShape =
      this.selectedShapeIndex !== null
        ? this.shapes[this.selectedShapeIndex] // Use selected shape if dragging
        : this.shapes[this.shapes.length - 1]; // Or the last created shape if drawing

      // Update the shape's dimensions
      currentShape.width = x - currentShape.x;
      currentShape.height = y - currentShape.y;
    }
  
    this.updateCanvas();
  }
  
  onCanvasMouseUp(): void {
    this.isDragging = false;

    // Handle shape creation
    if (this.currentTool === 'rectangle' || this.currentTool === 'circle') {
      if (this.shapes.length > 0) {
        const currentShape = this.shapes[this.shapes.length - 1];
  
        // Remove the shape if it has invalid dimensions
        if (currentShape.width === 0 || currentShape.height === 0) {
          this.shapes.pop();
        } else {
          // Finalize shape
          currentShape.selected = true;
        }
      }
    }
  }

  private getCanvasCoordinates(event: MouseEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * this.scaleX;
    const y = (event.clientY - rect.top) * this.scaleY;

    return { x, y };
  }
  
 
}
