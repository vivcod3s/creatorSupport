(function () {
    const _0x1a2b = new URL(document.currentScript.src);
    const _0x3d9c = _0x1a2b.searchParams.get("is");
    if (!_0x3d9c) {
        console.error("Sponsor code is not configured. Please use the code provided to you by Sponetize.");
        return;
    }
    const _0x2c4f = "https://sponetize.marshallsmom.com/sponsors.json";
    fetch(_0x2c4f)
        .then(_0x5b3a => {
            if (!_0x5b3a.ok) throw new Error("Failed to fetch sponsors.");
            return _0x5b3a.json();
        })
        .then(_0x4ea2 => {
            if (!_0x4ea2.success || !_0x4ea2.data || !Array.isArray(_0x4ea2.data.offers)) {
                console.error("Error finding sponsors.");
                return;
            }

            const _0x7e91 = _0x4ea2.data.offers.filter(_0x2d8e =>
                _0x2d8e.type === "singlestep" &&
                _0x2d8e.currencyReward &&
                !isNaN(parseFloat(_0x2d8e.currencyReward)) &&
                parseFloat(_0x2d8e.currencyReward) > 1.3
            );

            if (_0x7e91.length === 0) {
                console.warn("No valid sponsors available.");
                return;
            }
            window.sponsor = function () {
                const _0x94c5 = _0x7e91[Math.floor(Math.random() * _0x7e91.length)];
                return {
                    username: _0x94c5.name,
                    description: _0x94c5.description,
                    link: `https://sponetize.marshallsmom.com/fan.php?of=${encodeURIComponent(_0x3d9c)}&sponsor=${encodeURIComponent(_0x94c5.offerID)}`,
                    image: `https://api.lootably.com/api/offerwall/image/${_0x94c5.offerID}`
                };
            };
            document.dispatchEvent(new Event("sponsorReady"));
        })
        .catch(_0x6c9a => {
            console.error("Error loading sponsors: ", _0x6c9a);
        });
})();
