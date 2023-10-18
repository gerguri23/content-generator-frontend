import { LightningElement, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @track inputText = '';
    @track generatedText = '';

    handleTextChange(event) {
        this.inputText = event.target.value;
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
                    userMessage: this.inputText,
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
