# **AI SDR – Automated Sales Calling Agent**

AI SDR is an intelligent, autonomous sales calling agent that automatically calls prospects using a phone number provided by the user. It engages in natural, human-like conversations to introduce, explain, and promote products or services. The system is designed to assist sales teams by automating outreach, qualifying leads, and gathering customer insights—all via real-time voice calls.

---

## 🚀 **Features**

### **🤖 AI-Driven Phone Calls**

* Makes outbound calls to phone numbers supplied by the user.
* Uses conversational AI to talk with clients in real time.
* Handles greetings, pitch delivery, FAQs, objections, and call wrap-ups.

### **🗣️ Natural & Human-Like Conversation**

* Built with advanced LLM-powered agents.
* Maintains context, clarifies user questions, and responds dynamically.

### **🎯 Product-Focused Sales Conversations**

* Automatically generates product pitches based on the product details you provide.
* Customizable product scripts and talking points.

### **📞 Call Flow Management**

* Initiates calls using your telephony provider (e.g., Twilio, Asterisk, SIP, etc.).
* Monitors call status (ringing, answered, busy, failed).
* Handles call termination and escalation flows.

### **📝 Lead Qualification & Call Summary**

* Automatically summarizes the call.
* Extracts buyer intent, objections, interest score, next-step recommendations.
* Stores conversations and insights for CRM integration.

---

## 🧩 **Architecture Overview**

```
User Input → Product Details + Phone Number
            ↓
    AI SDR Agent (LLM)
            ↓
      Telephony Layer (e.g., Twilio)
            ↓
    Real-Time Call + Voice-to-Text + Text-to-Voice
            ↓
   AI Conversation Engine
            ↓
   Lead Summary + CRM Output (optional)
```

---

## 📦 **Tech Stack**

* **LLM / Agent Framework:** OpenAI, LangChain
* **Voice:** TTS + STT engines 
* **Telephony:** Twilio 
* **Backend:** Python 
* **Database (Optional):** MongoDB

---

## 🛠️ **Setup & Installation**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/ai-sdr.git
cd ai-sdr
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Add Environment Variables

Create a `.env` file:

```
OPENAI_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+123456789
```

### 4️⃣ Start the Application

```bash
python main.py
```

---

## 📞 **How to Use**

1. Provide:

   * The **phone number** the agent should call.
   * The **product details** (description, value prop, pricing, etc.).

2. Start the call:

```json
{
  "phone": "+15551234567",
  "product": "AI-powered email analytics tool that boosts reply rates by 40%."
}
```

3. The AI SDR will:

   * Place the call.
   * Deliver the sales pitch.
   * Answer questions.
   * Collect lead intent.
   * Generate a call report.

---

## 📄 **Output Example**

```
Call Result:
Lead Interest: High
Summary: The prospect is interested in a demo and wants pricing details.
Next Step: Schedule follow-up call next Tuesday.
Objections: Wants to confirm integration with HubSpot.
```

---

## 🧪 **Development Mode**

* Test locally using PSTN simulators or sandbox numbers.
* Enable verbose logs to monitor AI thinking, call flow, and debugging info.

---

---

## 🎯 **Roadmap**

* [ ] CRM integration (HubSpot, Salesforce)
* [ ] Multi-language calling support
* [ ] Emotion-aware conversation tuning
* [ ] Dashboard for call analytics
* [ ] Inbound calls support

---

## 🤝 **Contributing**

Contributions are welcome!
Please open an issue or submit a pull request.

---

## 📜 **License**

MIT License – free for personal and commercial use.

---
