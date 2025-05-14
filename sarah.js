(function () {
    const scriptUrl = new URL(document.currentScript.src);
    const username = scriptUrl.searchParams.get("is");
    if (!username) {
        console.error("Sponsor code is not configured. Please use the code provided to you by Sponetize.");
        return;
    }
    const sponsorsUrl = "https://sponetize.marshallsmom.com/sponsors.json";
    fetch(sponsorsUrl)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch sponsors.");
            return res.json();
        })
        .then(data => {
            if (!data.success || !data.data || !Array.isArray(data.data.offers)) {
                console.error("Error finding sponsors.");
                return;
            }

            // Filter for offers with devices array containing only "*" (universal devices)
            const filtered = data.data.offers.filter(offer =>
                offer.type === "singlestep" &&
                Array.isArray(offer.devices) &&
                offer.devices.length === 1 &&
                offer.devices[0] === "*" &&  // Only include offers with universal device "*"
                offer.currencyReward &&
                !isNaN(parseFloat(offer.currencyReward)) &&
                parseFloat(offer.currencyReward) > 1.3
            );

            if (filtered.length === 0) {
                console.warn("No valid sponsors available.");
                return;
            }
            window.sponsor = function () {
                const chosen = filtered[Math.floor(Math.random() * filtered.length)];
                return {
                    username: chosen.name,
                    description: chosen.description,
                    link: `https://sponetize.marshallsmom.com/fan.php?of=${encodeURIComponent(username)}&sponsor=${encodeURIComponent(chosen.offerID)}`,
                    image: `https://api.lootably.com/api/offerwall/image/${chosen.offerID}`
                };
            };
            document.dispatchEvent(new Event("sponsorReady"));
        })
        .catch(err => {
            console.error("Error loading sponsors: ", err);
        });
})();
