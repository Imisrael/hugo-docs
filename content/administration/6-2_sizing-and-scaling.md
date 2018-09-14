+++
title = "Sizing and Scaling"
weight = 2
+++

GridDB is a scale-out database that unlike a conventional DB, careful system design and sizing is not required in order to achieve non-stop operation. However, the following points should be considered as guidelines in the initial system design.

*   Memory usage
*   Number of nodes in a cluster
*   Disk usage

The estimation method is explained in sequence below.

Functions to increase the capacity by using external storage devices such as SSDs etc. have not been considered in calculating the memory size below. Please check with our service desk for estimation if these functions are used.

### Total memory usage

Predict the amount of data to be stored in the container and then estimate the memory usage.

First, predict the amount of data to be stored in the application. Estimate the following:

*   Data size of row
*   Number of rows to be registered

Next, estimate the memory required to store those estimated data.

Memory capacity used = row data size × no. of registered rows ÷ 0.75 + 8 × no. of registered rows × (assigned index number + 2) ÷ 0.66 (byte)

Perform a similar estimation for all collections created and used in the application. The total sum becomes the amount of memory required in the GridDB cluster.

*   Total memory usage = the sum of memory usage in all collections

However, please consider this number as the minimum requirement, as the memory usage also depends on update frequency.

### No. of Nodes Constituting a Cluster

Estimate the required no. of nodes used in GridDB. In the example below, it is assumed that one node is executed in one machine.

First, make an assumption of the memory required per machine.

*   Memory size of machine

In addition, make an assumption of the no. of replicas to create. The no. of replicas is given as a GridDB configuration value.

*   No. of replicas

Default no. of replicas is 2.

No. of nodes = (Total memory usage ÷ machine memory size) × no. of replicas (units)

However, please consider this as the minimum requirement as it is preferable to have a greater number of spare units to take into account the load distribution and availability improvement.
