import { LightningElement, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @track inputText = '';
    @track generatedText = '';
    @track userContentType = 'email';
    @track userTemperature = 1.0;
    @track userRecipient = 'sales';
    @track userIndustry = 'business services';

    get contentTypeOptions() {
        return [
            { label: 'Email', value: 'email' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' }
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
    }

    handleContentTypeChange(event) {
        this.userContentType = event.target.value;
    }

    handleTemperatureChange(event) {
        this.userTemperature = parseFloat(event.target.value);
    }

    handleRecipientChange(event) {
        this.userRecipient = event.target.value;
    }

    handleIndustryChange(event) {
        this.userIndustry = event.target.value;
    }

    handleClick() {
        this.callBackend();
    }

    async callBackend() {
        try {
             
            this.generatedText = "Loading...";

            // Simulate the delay to show the loading state  using Promise()
            new Promise((resolve) => {
              setTimeout(() => resolve(), 2000);
            }).then(() => {
              console.log(
                "The loading time is taking a bit longer that it supposed!"
              );
            });

            const response = await fetch('https://fluido-content-generator.azurewebsites.net/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userTopic: this.inputText,
                    userContentType: this.userContentType,
                    userTemperature: this.userTemperature,
                    userRecipient: this.userRecipient,
                    userIndustry: this.userIndustry,
                }),
            });

            const data = await response.json();
            this.generatedText = data.text;
        } catch (error) {
            console.error('Error:', error);
            this.generatedText = 'Error generating text';
        }
    }
}
