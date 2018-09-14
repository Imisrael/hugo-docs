Table of Contents

5.1.13 Data Retrieval
=====================

Overview
--------

This section describes the data acquisition of time-series container of GridDB in this chapter.

  

Data Acquisition
----------------

The following are methods to fetch and read TimeSeries containers:

### Specified time

Time to get the data (= low) of the series container, you will need to specify the time is Rouki of time series container.

**List.1 Acquire Data for a Specified Time** (TimeSeriesRetrieve.java)

// Specify Time
InstrumentLog log = logTs.get(format.parse("2016/07/02 12:00"));
System.out.println("get by Time");
System.out.println(String.format("%s\\t%-20s\\t%-10s", log.timestamp, log.weatherStationId,
        log.temperture));

*   Line 100: Use `TimeSeries.get (Date)` to get rows with a specified time stamp.

Execution results are as follows.

**List.2 Results**

get by Time
Sat Jul 02 12:00:00 EDT 2016 weather\_station\_1 80.0

  

### Specified range

Time series container will be able to get to specify the range to be retrieved.

**List.3 Aquire rows within a Range** (TimeSeriesRetrieve.java)

// Specify Time Range
System.out.println("get by Time Range");
Date start = format.parse("2016/07/02 9:00");
Date end = TimestampUtils.add(start, 6, TimeUnit.HOUR);

Query<InstrumentLog> query = logTs.query(start, end);
// fetch row
RowSet<InstrumentLog> rowSet = query.fetch();
while (rowSet.hasNext()) {
    InstrumentLog log = rowSet.next();
    System.out.println("Timestamp\\t\\t\\tWeatherStation ID\\tTemperture\\tLive Image");
    System.out.println(String.format("%s\\t%-20s\\t%-10s\\t%s", log.timestamp,
            log.weatherStationId, log.temperture));
}

*   Line 119-120: Generate the start and end time for the range.
*   Line 122: Use `TimeSeries.query (Date, Date)` method with start and end times for the range of data to fetch.
*   Line 124-126: Fetch rows.

Execution results are as follows.

**List.4 Results**

get by Time Range
Sat Jul 02 09:00:00 EDT 2016 weather\_station\_1 75.0
Sat Jul 02 12:00:00 EDT 2016 weather\_station\_1 80.0
Sat Jul 02 15:00:00 EDT 2016 weather\_station\_1 75.0

  

### Relative Time

You can fetch rows with timestamps are earlier or later than specified timestamp with the `TimeOperator` enum.

**Table 1 TimeOperator Enum**

Acquisition method

Description

TimeOperator.NEXT

Returns the oldest among the Rows whose timestamp are identical with or later than the specified time.

TimeOperator.NEXT_ONLY

Returns the oldest among the Rows whose timestamp are later than the specified time.

TimeOperator.PREVIOUS

Returns the newest among the Rows whose timestamp are identical with or earlier than the specified time.

TimeOperator.PREVIOUS_ONLY

Returns the newest among the Rows whose timestamp are earlier than the specified time.

  

**Fetching Rows with a Relative Time stamp** (TimeSeriesRetrieve.java)

// Specify the next time, including a specified time
InstrumentLog log = logTs.get(format.parse("2016/07/02 12:00"), TimeOperator.NEXT);
System.out.println("get by Next Time");
System.out.println(String.format("%s\\t%-20s\\t%-10s", log.timestamp, log.weatherStationId,
        log.temperture));

// Specify the next time
log = logTs.get(format.parse("2016/07/02 12:00"), TimeOperator.NEXT_ONLY);
System.out.println("get by NextOnly Time");
System.out.println(String.format("%s\\t%-20s\\t%-10s", log.timestamp, log.weatherStationId,
        log.temperture));

// Specify the previous time, including a specified time
log = logTs.get(format.parse("2016/07/02 12:00"), TimeOperator.PREVIOUS);
System.out.println("get by Previous Time");
System.out.println(String.format("%s\\t%-20s\\t%-10s", log.timestamp, log.weatherStationId,
        log.temperture));

// Specify the previous time
log = logTs.get(format.parse("2016/07/02 12:00"), TimeOperator.PREVIOUS_ONLY);
System.out.println("get by PreviousOnly Time");
System.out.println(String.format("%s\\t%-20s\\t%-10s", log.timestamp, log.weatherStationId,
        log.temperture));

*   Line 144: you get to specify the `TimeOperator.NEXT`.
*   Line 150: you get to specify the `TimeOperator.NEXT_ONLY`.
*   Line 156: you get to specify the `TimeOperator.PREVIOUS`.
*   Line 162: you get to specify the `TimeOperator.PREVIOUS_ONLY`.

Serving as a reference time has designated all `" 2016/07/02 12:00 "`.

Execution results are as follows.

**List.6 Results** that the constant time was on the basis of

get by Next Time
Sat Jul 02 12:00:00 EDT 2016 weather\_station\_1 80.0
get by NextOnly Time
Sat Jul 02 15:00:00 EDT 2016 weather\_station\_1 75.0
get by Previous Time
Sat Jul 02 12:00:00 EDT 2016 weather\_station\_1 80.0
get by PreviousOnly Time
Sat Jul 02 09:00:00 EDT 2016 weather\_station\_1 75.0

  

### Aggregatation

Time series container is able to aggregate the data for the specified time period.

**List.7 Aggregate Average**

// Average Temperature
Date start = format.parse("2016/07/01 12:00");
Date end = format.parse("2016/07/02 9:00");
AggregationResult aggrResult =
        logTs.aggregate(start, end, "temperture", Aggregation.AVERAGE);
System.out.println("Average Temperature:" + aggrResult.getDouble() + "\\n");

*   181-182 line: `TimeSeries.aggregate (Date, Date, String, Aggregation)` method You have a summary to find the average value of the temperature.

Execution results are as follows.

**List.8 Aggregate Results**

Average Temperature: 67.5

The different types of Aggregation methods are as follows:

**Table 2 Aggregation types**

Aggregation method

Description

Aggregation.AVERAGE

Obtain the average value.

Aggregation.COUNT

Obtain the number of samples.

Aggregation.MAXIMUM

Obtain the maximum value.

Aggregation.MINIMUM

Obtain the minimum value.

Aggregation.STANDARD_DEVIATION

Obtain the standard deviation.

Aggregation.TOTAL

Obtain the total value (sum).

Aggregation.VARIANCE

Obtain the variance within the rows.

Aggregation.WEIGHTED_AVERAGE

Obtain the weighted average.

For more information, please refer to the [GridDB API Reference](/en/docs/GridDB_API_Reference.html)

  

Complete source code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [timeseries-retrieve.zip](img/timeseries-retrieve.zip)
