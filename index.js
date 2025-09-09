
try {
    if ($response.body) {
        let responseData;
        try {
            responseData = JSON.parse($response.body);
            
            // Extract the card number
            const cardNumber = responseData?.cusInfResp?.xtraCard?.encodedXtraCardNbr;
            
            if (cardNumber) {
                // Generate barcode URL
                const barcodeUrl = `https://vratasram.xyz/api/cvs/barcode?code=${cardNumber}`;
                
                // Create notification with barcode image and clickable URL
                var attach = {
                    "openUrl": barcodeUrl,
                    "mediaUrl": barcodeUrl,
                    "clipboard": cardNumber
                };
                
                // notification
                $notification.post('CVS Plugin', 'Successfully Retrieved Coupon', `Card: ${cardNumber}`, attach);
                
                $done({});
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