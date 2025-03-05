import { Component, ElementRef, OnInit, Renderer2, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-camera-feed',
  standalone: true,
  imports: [],
  templateUrl: './camera-feed.component.html',
  styleUrl: './camera-feed.component.css'
})
export class CameraFeedComponent implements OnInit {
  @Input() projectTag!: string; // Receive projectTag from LiveviewComponent

  private appKey = "itwwm7benooi6li6p4p1xrz5rsgy1l9e";
  private appSecret = "kpivtt3r0bfv4eb2dl7apv1icyl8z48z";

  private accessToken: string = "";
  private streamToken: string = "";
  private secretKey: string = "";
  private serialNumber: string = "";
  private accessTokenExpiry: number = 0;
  private streamTokenExpiry: number = 0;

  private channelNumber = "1";
  private videoResolution = "hd";
  private domain = "https://isgpopen.ezvizlife.com";
  
  private pluginScriptUrl = 'assets/dist/jsPlugin-3.0.0.min.js'; // Make sure the JS file is placed here

  private projectTagMap: { [key: string]: { secretKey: string, serialNumber: string } } = {
    gugg1: { secretKey: "guggenheim12", serialNumber: "AF5940863" },
    stg: { secretKey: "Gcc12345", serialNumber: "L20487325" },
    prime: { secretKey: "primeHGCC24", serialNumber: "AW6953961" },
    puredc: { secretKey: "LOpuredata", serialNumber: "J73296798" },
    proj: { secretKey: "Lsl12345", serialNumber: "FD3699842" },
  };

  constructor(
    private elRef: ElementRef, 
    private renderer: Renderer2, 
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    if (!this.projectTag) {
      console.error("ProjectTag is missing!");
      return;
    }

    // Retrieve correct secretKey & serialNumber based on projectTag
    const projectData = this.projectTagMap[this.projectTag];
    if (!projectData) {
      console.error("Invalid projectTag!");
      return;
    }
    this.secretKey = projectData.secretKey;
    this.serialNumber = projectData.serialNumber;

     // Fetch all tokens in a single request
     this.tokenService.getAllTokens().subscribe(tokens => {
        this.accessToken = tokens.accessToken;
        this.accessTokenExpiry = tokens.accessTokenExpiry;
        this.streamToken = tokens.streamToken;
        this.streamTokenExpiry = tokens.streamTokenExpiry;
        
        console.log("Tokens Received:", tokens);

        // Check if tokens are expired before proceeding
        if (this.isTokenExpired(this.accessTokenExpiry) || this.isTokenExpired(this.streamTokenExpiry)) {
          console.log("Tokens expired, fetching new ones...");
          this.getAccessToken(); // Fetch new access and stream tokens
        } else {
          console.log("Tokens are valid, proceeding with Live View.");
          this.loadScript().then(() => this.initializeLiveView());
        }
    });

  }

  private isTokenExpired(expiryTime: number): boolean {
    const currentTime = Date.now();
    return currentTime >= expiryTime;
  }


  private getAccessToken(): void {
    const tokenUrl = "https://isgp.hikcentralconnect.com/api/hccgw/platform/v1/token/get";
    const body = {
      appKey: this.appKey,
      secretKey: this.appSecret,
    };

    this.http.post(tokenUrl, body).subscribe({
      next: (response: any) => {
        if (response.errorCode === "0") {
          this.accessToken = response.data.accessToken;
          this.accessTokenExpiry = response.data.expireTime;
          console.log("Access Token Fetched:", this.accessToken);
          this.getStreamToken();
        } else {
          console.error("Error fetching access token:", response);
        }
      },
      error: (err) => console.error("Failed to fetch access token:", err)
    });
  }

  /**
   * Get the stream token using the access token
   */
  private getStreamToken(): void {
    const streamTokenUrl = "https://isgp.hikcentralconnect.com/api/hccgw/platform/v1/streamtoken/get";
    
    const headers = new HttpHeaders({
      Token: this.accessToken
    });

    this.http.get(streamTokenUrl, { headers }).subscribe({
      next: (response: any) => {
        if (response.errorCode === "0") {
          this.streamToken = response.data.appToken;
          this.streamTokenExpiry = response.data.expireTime;
          console.log("Stream Token Fetched:", this.streamToken);
          this.tokenService.saveTokens(this.accessToken,this.accessTokenExpiry, this.streamToken, this.streamTokenExpiry);
          this.loadScript().then(() => {
            this.initializeLiveView();
          });
        } else {
          console.error("Error fetching stream token:", response);
        }
      },
      error: (err) => console.error("Failed to fetch stream token:", err)
    });
  }


  /**
   * Dynamically loads the JSPlugin script.
   */
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('jsPluginScript')) {
        resolve(); // Script already loaded
        return;
      }

      const script = this.renderer.createElement('script');
      script.id = 'jsPluginScript';
      script.type = 'text/javascript';
      script.src = this.pluginScriptUrl;
      script.onload = () => resolve();
      script.onerror = () => reject("Failed to load script: " + this.pluginScriptUrl);
      this.renderer.appendChild(document.body, script);
    });
  }

  /**
   * Initializes the live view player after script is loaded.
   */
  private initializeLiveView(): void {
    const container = this.elRef.nativeElement.querySelector("#playWind");

    if (!container) {
      console.error("Live View container not found!");
      return;
    }

    const oPlugin = new (window as any).JSPlugin({
      szId: "playWind",
      iWidth: 750,
      iHeight: 500,
      szBasePath: "./assets/dist",
      iMaxSplit: 1, // Ensure only 1 channel is used
      oStyle: {
        border: "#343434",
        background: "#4C4B4B"
      }
    });

    oPlugin.JS_ArrangeWindow(1, false).then(
      () => console.log("JS_ArrangeWindow success"),
      () => console.log("JS_ArrangeWindow failed")
    );

    let realplayFinished = true;

    if (!realplayFinished) return;

    const url = `ezopen://open.ezviz.com/${this.serialNumber}/${this.channelNumber}`;
    const finalUrl = this.videoResolution === "hd" ? `${url}.hd.live` : `${url}.live`;

    if (this.secretKey) {
      oPlugin.JS_SetSecretKey(0, this.secretKey).then(
        () => console.log("JS_SetSecretKey success"),
        () => console.log("JS_SetSecretKey failed")
      );
    }

    realplayFinished = false;

    oPlugin.JS_Play(finalUrl, {
      playURL: finalUrl,
      ezuikit: true,
      env: { domain: this.domain },
      accessToken: this.accessToken,
      mode: "media"
    }, 0).then(
      () => {
        realplayFinished = true;
        console.log("realplay success");
      },
      () => {
        realplayFinished = true;
        console.log("realplay failed");
      }
    );
  }

}
