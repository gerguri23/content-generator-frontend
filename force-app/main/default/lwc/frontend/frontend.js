import { LightningElement, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @track inputText = '';
    @track generatedText = '';
    @track userContentType = 'email';
    @track userTemperature = 1.0;
    @track userRecipient = 'sales';

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

    handleClick() {
        this.callBackend();
    }

    async callBackend() {
        try {
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
