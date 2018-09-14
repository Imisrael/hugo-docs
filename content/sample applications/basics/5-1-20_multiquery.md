Table of Contents

5.1.20 Multi-Query
==================

What is Multi-Query
-------------------

Note: The concept of Multi-Query is described in our [GridDB_TechnicalReference (Section 4.7.2)](/en/docs/GridDB_TechnicalReference.pdf)

Create query
------------

**List.1 Create query**(MultiQuery.java)

private static List<Query<?>> createQueries(TimeSeries<InstrumentLog> logTs)
        throws ParseException, GSException {
    // Set TimeSeries conditions
    Date start = TimestampUtils.getFormat().parse("2016-07-01T06:00:00Z");
    Date end = TimestampUtils.getFormat().parse("2016-07-01T18:00:00Z");

    List<Query<?>> queries = new ArrayList<>();

    // Get Max Temperture
    String maxTempertureTql = String.format(
            "SELECT MAX(temperture) WHERE"
                    \+ " TIMESTAMP('%s') < timestamp AND timestamp < TIMESTAMP('%s')",
            TimestampUtils.format(start), TimestampUtils.format(end));
    Query<AggregationResult> maxTempertureQuery =
            logTs.query(maxTempertureTql, AggregationResult.class);
    queries.add(maxTempertureQuery);

    // Get Min Temperture
    String minTempertureTql = String.format(
            "SELECT MIN(temperture) WHERE"
                    \+ " TIMESTAMP('%s') < timestamp AND timestamp < TIMESTAMP('%s')",
            TimestampUtils.format(start), TimestampUtils.format(end));
    Query<AggregationResult> minTempertureQuery =
            logTs.query(minTempertureTql, AggregationResult.class);
    queries.add(minTempertureQuery);

    // Get Average
    String avgTempertureTql = String.format(
            "SELECT AVG(temperture) WHERE"
                    \+ " TIMESTAMP('%s') < timestamp AND timestamp < TIMESTAMP('%s')",
            TimestampUtils.format(start), TimestampUtils.format(end));
    Query<AggregationResult> avgTempertureQuery =
            logTs.query(avgTempertureTql, AggregationResult.class);
    queries.add(avgTempertureQuery);

    // Retrieve by time range
    Query<InstrumentLog> timeRangeQuery = logTs.query(start, end);
    queries.add(timeRangeQuery);

    return queries;
}

Multi-Query execution
---------------------

**List.2 Multi-Query execution**(MultiQuery.java)

// Create Connection
store = gridLogic.createGridStore();

// Get InstrumentLog
TimeSeries<InstrumentLog> logTs =
        store.getTimeSeries("weather\_station\_1", InstrumentLog.class);

// Create query list
List<Query<?>> queries = createQueries(logTs);

// Execute Multi Query
store.fetchAll(queries);

Result of Multi-Query execution
-------------------------------

**List.3 Obtain of Multi-Query results**(MultiQuery.java)

// Retrieve reulsts
for (Query<?> query : queries) {
    RowSet<?> rowSet = query.getRowSet();
    while (rowSet.hasNext()) {
        Object rowObj = rowSet.next();
        if (rowObj instanceof AggregationResult) {
            // When retrieve AggregationResult
            AggregationResult aggregation = (AggregationResult) rowObj;
            System.out.println("AggregationResult:" + aggregation.getDouble());

        } else if (rowObj instanceof InstrumentLog) {
            // When retrieve InstrumentLog
            InstrumentLog log = (InstrumentLog) rowObj;
            System.out.println(String.format("%s\\t%-20s\\t%-10s", log.timestamp,
                    log.weatherStationId, log.temperture));

        } else {
            // Do not reach in this sample
            System.out.println(rowObj);
        }
    }
}

**List.4 Result of Multi-Get execution**

AggregationResult:70.0
AggregationResult:50.0
AggregationResult:60.0
Fri Jul 01 15:00:00 EDT 2016    weather\_station\_1       75.0
Fri Jul 01 18:00:00 EDT 2016    weather\_station\_1       70.0
Fri Jul 01 21:00:00 EDT 2016    weather\_station\_1       60.0
Sat Jul 02 00:00:00 EDT 2016    weather\_station\_1       50.0
Sat Jul 02 03:00:00 EDT 2016    weather\_station\_1       60.0
AggregationResult:70.0
AggregationResult:50.0
AggregationResult:60.0
Fri Jul 01 15:00:00 EDT 2016    weather\_station\_2       75.0
Fri Jul 01 18:00:00 EDT 2016    weather\_station\_2       70.0
Fri Jul 01 21:00:00 EDT 2016    weather\_station\_2       60.0
Sat Jul 02 00:00:00 EDT 2016    weather\_station\_2       50.0
Sat Jul 02 03:00:00 EDT 2016    weather\_station\_2       60.0

Source Code
-----------

Complete source code used in this sample can be downloaded from the following.

[Download:multi-query.zip](img/multi-query.zip)
