
console.log("hello world");

try {

    console.log("Request URL:", $request.url);
    console.log("Request Method:", $request.method);
    console.log("Request Headers:", JSON.stringify($request.headers, null, 2));
    

    console.log("Response Status:", $response.status);
    console.log("Response Headers:", JSON.stringify($response.headers, null, 2));
    

    if ($response.body) {
        console.log("Response Body Type:", typeof $response.body);
        console.log("Response Body Length:", $response.body.length);
        
        let responseData;
        try {
            responseData = JSON.parse($response.body);
            console.log("Parsed CVS Response:", JSON.stringify(responseData, null, 2));
        } catch (parseError) {
            console.log("Failed to parse response as JSON:", parseError.message);
            console.log("Raw Response Body:", $response.body);
            responseData = { raw_body: $response.body };
        }
        
        const postData = {
            source: "cvs_interceptor",
            timestamp: new Date().toISOString(),
            original_url: $request.url,
            cvs_response: responseData
        };
        
        console.log("Sending data to bubbl.so/cvs:", JSON.stringify(postData, null, 2));
        
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
                console.log("POST request failed:", error);
            } else {
                console.log("POST request successful");
                console.log("Response Status:", response.status);
                console.log("Response Data:", data);
            }
            
            $done({});
        });
        
    } else {
        console.log("No response body found");
        $done({});
    }
    
} catch (error) {
    console.log("Script error:", error.message);
    console.log("Error stack:", error.stack);
    $done({});
}