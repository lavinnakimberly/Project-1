<cfinvoke component="api" method="getRecommendations" returnVariable="recommendations">
    <cfinvokeargument name="term" value="cafe">
    <cfinvokeargument name="location" value="San Diego">
    <cfinvokeargument name="key" value="1234567890">
</cfinvoke>
<cfdump var="#recommendations#">

