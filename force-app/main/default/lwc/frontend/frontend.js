import { LightningElement, track } from 'lwc';
import FrontEnd from './frontend.css'

export default class MyComponent extends LightningElement {
    static stylesheets = [FrontEnd];

    @track inputText = '';
    @track generatedText = '';
    @track userContentType = 'email';
    @track userTemperature = 0.5;
    @track userRecipient = 'sales';
    @track customRecipient = '';
    @track userIndustry = 'business services';
    @track adobeStockLink = '';
    @track finalPrompt = '';
    @track readOnly = true;
    @track customRecipientDisabled = true;

    get contentTypeOptions() {
        return [
            { label: 'Email', value: 'email' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'White paper', value: 'whitepaper'},
            { label: 'Blog', value: 'blog'},
            { label: ' E-book', value: 'e-book'}
        ];
    }

    // Getter for recipient options
    get recipientOptions() {
        return [
            { label: 'Sales', value: 'sales' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Customer Service', value: 'customer service' },
            { label: 'IT', value: 'it' },
            { label: 'Business Development', value: 'business development' },
            { label: 'Senior Management', value: 'senior management' },
            { label: 'Procurement', value: 'procurement' },
            { label: 'Other', value: 'other' }
        ];
    }

    get industryOptions() {
        return [
            { label: 'Business Services', value: 'business services' },
            { label: 'Communications and Media', value: 'communications and media' },
            { label: 'Construction', value: 'construction' },
            { label: 'Consumer Goods, Retail and Logistics', value: 'consumer goods, retail and logistics' },
            { label: 'Communications and Media', value: 'communications and media' },
            { label: 'Education', value: 'education' },
            { label: 'Energy and Utilities', value: 'energy and utilities' },
            { label: 'Finance', value: 'finance' },
            { label: 'Healthcare and Lifescience', value: 'healthcare and lifescience' },
            { label: 'Hospitality and Recreation', value: 'hospitality and recreation' },
            { label: 'Manufacturing', value: 'manufacturing' },
            { label: 'Not For Profit', value: 'not for profit' },
            { label: 'Public', value: 'public' },
            { label: 'Technology', value: 'technology' },
            { label: 'Telecommunications', value: 'telecommunications' }
        ];
    }

    handleTextChange(event) {
        this.inputText = event.target.value;
        this.getPrompt();
    }

    handleContentTypeChange(event) {
        this.userContentType = event.target.value;
        this.getPrompt();
    }

    handleTemperatureChange(event) {
        this.userTemperature = parseFloat(event.target.value);
    }

    handleRecipientChange(event) {
        if(event.target.value === "other") {
            this.customRecipientDisabled = false;
            this.customRecipient = '';
        } else {
            this.customRecipient = '';
            this.customRecipientDisabled = true;
            this.userRecipient = event.target.value;
        }
        this.getPrompt();
    }

    handleCustomRecipientChange(event) {
        this.userRecipient = event.target.value;
        this.getPrompt();

    }
    handleIndustryChange(event) {
        this.userIndustry = event.target.value;
        this.getPrompt();
    }

    handleFinalPromptChange(event) {
        this.finalPrompt = event.target.value;
    }

    handleGenerateClick() {
        this.callBackend();

    }

    handlePromptClick() {
        this.getPrompt();
    }

    textCallBack(){
        this.handleCopy();
        alert("Texted is copied");
    }
    async handleCopy() {
        let msg = `Copied Text is:  \n ${this.generatedText} 
        \nAdobe Stock Image Link: \n ${this.adobeStockLink}`;
    
        if (navigator.clipboard && window.isSecureContext) {
          return navigator.clipboard.writeText(msg.replace(/<br\s*[/]?>/gi, '').replace(/<b\s*[/]?>/gi, '').replace(/<\/b\s*[/]?>/gi, ''));
        } 
      }
    async callBackend() {
        try {
             
            this.generatedText = "Loading...";

           /* // Simulate the delay to show the loading state  using Promise()
            new Promise((resolve) => {
              setTimeout(() => resolve(), 2000);
            }).then(() => {
              console.log(
                "The loading time is taking a bit longer that it supposed!"
              );
            });
*/
            const response = await fetch('https://marketing-content-generator-02c05e08f82e.herokuapp.com/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMessage: this.finalPrompt,
                    userTemperature: this.userTemperature,
                }),
            });

            const data = await response.json();
            //Testi
            console.log('Response from backend:', data);
            this.generatedText = data.text;
            
            const responseLink = await fetch('https://marketing-content-generator-02c05e08f82e.herokuapp.com/generate-query-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userTopic: this.inputText,
                userIndustry: this.userIndustry,
                userTemperature: this.userTemperature,
            }),
        });

        const dataLink = await responseLink.json();
        console.log('Response from link generation:', dataLink);
        this.adobeStockLink = dataLink.searchQuery;

           

            
        } catch (error) {
            console.error('Error:', error);
            this.generatedText = 'Error generating text';
            this.adobeStockLink = 'Error generating the link';
        }
    }
    async getPrompt() {
        try {
            const response = await fetch('https://marketing-content-generator-02c05e08f82e.herokuapp.com/check-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userTopic: this.inputText,
                    userContentType: this.userContentType,
                    userRecipient: this.userRecipient,
                    userIndustry: this.userIndustry,
                }),
            });

            const data = await response.json();
            this.finalPrompt = data.text;
            //Testi
            console.log('Response from backend:', data);
       } catch (error) {
            console.error('Error:', error);
            this.finalPrompt = "Error getting prompt";
        }
    }
}
