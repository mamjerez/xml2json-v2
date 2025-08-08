/**
 * Performance benchmarking utilities
 */
class PerformanceMonitor {
    constructor() {
        this.timers = new Map();
        this.metrics = new Map();
    }

    /**
     * Start timing an operation
     * @param {string} name - Name of the operation
     */
    start(name) {
        this.timers.set(name, {
            start: Date.now(),
            memory: process.memoryUsage(),
        });
    }

    /**
     * End timing an operation and return results
     * @param {string} name - Name of the operation
     * @returns {object} Performance metrics
     */
    end(name) {
        const timer = this.timers.get(name);
        if (!timer) {
            throw new Error(`Timer '${name}' not found`);
        }

        const endTime = Date.now();
        const endMemory = process.memoryUsage();

        const metrics = {
            duration: endTime - timer.start,
            durationMinutes: ((endTime - timer.start) / 60000).toFixed(2),
            memoryStart: timer.memory,
            memoryEnd: endMemory,
            memoryDelta: {
                rss: endMemory.rss - timer.memory.rss,
                heapUsed: endMemory.heapUsed - timer.memory.heapUsed,
                heapTotal: endMemory.heapTotal - timer.memory.heapTotal,
                external: endMemory.external - timer.memory.external,
            },
        };

        this.metrics.set(name, metrics);
        this.timers.delete(name);

        return metrics;
    }

    /**
     * Get all collected metrics
     * @returns {object} All performance metrics
     */
    getAllMetrics() {
        return Object.fromEntries(this.metrics);
    }

    /**
     * Format memory usage in MB
     * @param {number} bytes - Memory in bytes
     * @returns {string} Formatted memory string
     */
    formatMemory(bytes) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    }

    /**
     * Print performance report
     * @param {string} operation - Optional operation name to report
     */
    printReport(operation = null) {
        const metrics = operation ? { [operation]: this.metrics.get(operation) } : Object.fromEntries(this.metrics);

        console.log('\n=== PERFORMANCE REPORT ===');

        Object.entries(metrics).forEach(([name, metric]) => {
            if (metric) {
                console.log(`\n${name.toUpperCase()}:`);
                console.log(`  Duration: ${metric.durationMinutes} minutes`);
                console.log(`  Memory Usage:`);
                console.log(`    RSS Delta: ${this.formatMemory(metric.memoryDelta.rss)}`);
                console.log(`    Heap Used Delta: ${this.formatMemory(metric.memoryDelta.heapUsed)}`);
                console.log(`    Final Heap Used: ${this.formatMemory(metric.memoryEnd.heapUsed)}`);
            }
        });

        console.log('\n=== END PERFORMANCE REPORT ===\n');
    }

    /**
     * Clear all metrics
     */
    clear() {
        this.timers.clear();
        this.metrics.clear();
    }
}

module.exports = PerformanceMonitor;
