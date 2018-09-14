Table of Contents

5.1.21 Multi-Get
================

What is Multi-Get
-----------------

Note: The concept of Multi-Get is described in our [GridDB_TechnicalReference (Section 4.7.2)](/en/docs/GridDB_TechnicalReference.pdf)

Create the acquisition conditions
---------------------------------

**List.1 Create the acquisition conditions**(MultiGet.java)

private static Map<String, RowKeyPredicate<?>> createMultiGetCondition(
                Collection<String, WeatherStation> weatherStationCol)
                throws GSException, ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm", Locale.US);

        // Create search condition of WeatherStation
        RowKeyPredicate<String> wsRowKeys = RowKeyPredicate.create(String.class);

        // Create multiget condition
        Map<String, RowKeyPredicate<?>> containerPredicateMap = new HashMap<>();
        for (int i = 0; i < 2; i++) {
                // Get WeatherStation
                WeatherStation weatherStation = weatherStationCol.get(String.valueOf(i + 1));
                wsRowKeys.add(weatherStation.id);

                // Create search condition of InstrumentLog
                RowKeyPredicate<Date> logRowKeys = RowKeyPredicate.create(Date.class);
                // Set TimeSeries Rows Timestamp
                logRowKeys.setStart(format.parse("2016/07/02 6:00"));
                logRowKeys.setFinish(format.parse("2016/07/02 12:00"));
                // Add ContainerName and RowKeyPredicate
                String logContainerName = "weather\_station\_" + weatherStation.id;

                // Put multiget condition
                containerPredicateMap.put(logContainerName, logRowKeys);
        }
        // Put multiget condition
        String wsContainerName = "weather_station";
        containerPredicateMap.put(wsContainerName, wsRowKeys);
        return containerPredicateMap;
}

Multi-Get execution
-------------------

**List.2 Multi-Get execution**(MultiGet.java)

// Create Connection
store = gridLogic.createGridStore();

// Get Collection
Collection<String, WeatherStation> weatherStationCol =
        store.getCollection("weather_station", WeatherStation.class);

// Create MultiGet parameters
Map<String, RowKeyPredicate<?>> containerPredicateMap =
        careteMultiGetCondition(weatherStationCol);

// Get by multiget
Map<String, List<Row>> multiGetResults = store.multiGet(containerPredicateMap);

Result of Multi-Get execution
-----------------------------

**List.3 Obtain of Multi-Get results**(MultiGet.java)

// Retrieve results
for (Entry<String, List<Row>> multiGetResult : multiGetResults.entrySet()) {
    // Container Name
    String containerName = multiGetResult.getKey();
    System.out.println(containerName + " ################");

    if ("weather_station".equals(containerName)) {
        // Retrieve WeatherStation Rows
        retieveWeatherStationRows(multiGetResult);
    } else {
        // Retrieve InstrumentLog Rows
        retrieveInstrumentLogRows(multiGetResult);
    }
}

**List.4 Result of Multi-Get execution**

weather\_station\_2 ################
Timestamp                       WeatherStation ID       Temperature      Live Image
Sat Jul 02 06:00:00 JST 2016    weather\_station\_2       70.0            None
Sat Jul 02 09:00:00 JST 2016    weather\_station\_2       75.0            None
Sat Jul 02 12:00:00 JST 2016    weather\_station\_2       80.0            None
weather_station ################
ID      Name                    Longitude               Latitude        Camera
1       Hokkaido-Sapporo        43.06417                141.34694       true
2       Aomori-Aomori           40.82444                140.74          true
weather\_station\_1 ################
Timestamp                       WeatherStation ID       Temperature      Live Image
Sat Jul 02 06:00:00 JST 2016    weather\_station\_1       70.0            None
Sat Jul 02 09:00:00 JST 2016    weather\_station\_1       75.0            None
Sat Jul 02 12:00:00 JST 2016    weather\_station\_1       90.0            None

Source Code
-----------

Complete source code used in this sample can be downloaded from the following.

Download:[multi-get.zip](img/multi-get.zip)
