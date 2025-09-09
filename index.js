
// notification
$notification.post('CVS Plugin', 'Script Started', 'CVS interceptor script is running');

try {

    // notification
    $notification.post('CVS Plugin', 'Request Info', `URL: ${$request.url}`);
    // notification
    $notification.post('CVS Plugin', 'Request Method', $request.method);
    // notification
    $notification.post('CVS Plugin', 'Request Headers', JSON.stringify($request.headers, null, 2));
    

    // notification
    $notification.post('CVS Plugin', 'Response Status', $response.status.toString());
    // notification
    $notification.post('CVS Plugin', 'Response Headers', JSON.stringify($response.headers, null, 2));
    

    if ($response.body) {
        // notification
        $notification.post('CVS Plugin', 'Response Body Type', typeof $response.body);
        // notification
        $notification.post('CVS Plugin', 'Response Body Length', $response.body.length.toString());
        
        let responseData;
        try {
            responseData = JSON.parse($response.body);
            // notification
            $notification.post('CVS Plugin', 'Parsed CVS Response', JSON.stringify(responseData, null, 2));
        } catch (parseError) {
            // notification
            $notification.post('CVS Plugin', 'Parse Error', parseError.message);
            // notification
            $notification.post('CVS Plugin', 'Raw Response Body', $response.body);
            responseData = { raw_body: $response.body };
        }
        
        const postData = {
            source: "cvs_interceptor",
            timestamp: new Date().toISOString(),
            original_url: $request.url,
            cvs_response: responseData
        };
        
        // notification
        $notification.post('CVS Plugin', 'Sending Data', JSON.stringify(postData, null, 2));
        
        $httpClient.post({
            url: "https://bubbl.so/cvs",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "CVS-Loon-Plugin/1.0"
            },
            body: JSON.stringify(postData),
            timeout: 10000
        }, function(error, response, data) {
            if (error) {
                // notification
                $notification.post('CVS Plugin', 'POST Failed', error);
            } else {
                // notification
                $notification.post('CVS Plugin', 'POST Success', 'Request completed successfully');
                // notification
                $notification.post('CVS Plugin', 'API Response Status', response.status.toString());
                // notification
                $notification.post('CVS Plugin', 'API Response Data', data);
            }
            
            $done({});
        });
        
    } else {
        // notification
        $notification.post('CVS Plugin', 'No Body', 'No response body found');
        $done({});
    }
    
} catch (error) {
    // notification
    $notification.post('CVS Plugin', 'Script Error', error.message);
    // notification
    $notification.post('CVS Plugin', 'Error Stack', error.stack);
    $done({});
}