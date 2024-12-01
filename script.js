document.getElementById("input-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const ambientTemp = document.getElementById("ambient-temp").value;
    const moduleTemp = document.getElementById("module-temp").value;
    const irradiance = document.getElementById("irradiance").value;
  
    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ambientTemp,
        moduleTemp,
        irradiance,
      }),
    });
  
    const result = await response.json();
    document.getElementById("result").innerText = `Submitted Values: Ambient Temp: ${result.ambientTemp}°C, Module Temp: ${result.moduleTemp}°C, Irradiance: ${result.irradiance} W/m²`;
  });
  