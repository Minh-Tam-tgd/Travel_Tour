async function test() {
    const key = "AQ.Ab8RN6JygOKN8CD1gftXdoU3QB9Z9qbtFRNiIRQ-ZbJ1p3qEuw";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: "hi" }] }]
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
}

test();

test();

test();
