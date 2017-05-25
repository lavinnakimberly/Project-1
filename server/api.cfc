<cfcomponent>
<cffunction name="getRecommendations" access="remote">
    <cfargument name="term" default="" required="true">
    <cfargument name="location" default="" required="true">
    <cfargument name="key" default="" required="true">

    <cfset local.correctKey = "1234567890">

    <cfif arguments.key eq local.correctKey>
        <cfhttp url="https://api.yelp.com/v3/businesses/search?" method="get">
            <cfhttpparam type="Header" name="Authorization"  value="Bearer 5u1vBzlUZtkYZgd-AGdYh17UWZiTW69u70bpFgnGUEwwhCLXjJV9qoveHkK6QKyryr81NwG4YtckIsnfA88qa7GZAov95IvyOaJnjvArumbCjlvp2eXr3UOPrP8kWXYx"> 
            <cfhttpparam type="url" name="term" value="#URLEncodedFormat(arguments.term)#">
            <cfhttpparam type="url" name="location" value="#URLEncodedFormat(arguments.location)#">
        </cfhttp>
        <cfset yelpResponse = cfhttp.fileContent>
    <cfelse>
        <cfset yelpResponse = "Wrong Key">
    </cfif>

	<cfreturn yelpResponse>
</cffunction>
</cfcomponent>