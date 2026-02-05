/**
 * Glassmorphism Performance Measurement Script
 *
 * Run in browser console on component-showcase pages to measure actual performance.
 * Tests paint time, FPS, memory usage, and layer count for glass effects.
 *
 * Usage:
 *   1. Open component-showcase in browser (http://localhost:3100)
 *   2. Open DevTools Console (Cmd+Option+J on Mac, Ctrl+Shift+J on Windows)
 *   3. Copy and paste this entire script
 *   4. Run: measureGlassPerformance()
 */

window.measureGlassPerformance = function() {
  console.log('%c🔬 Glass Performance Analyzer', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #64748b;');

  const results = {
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    metrics: {}
  };

  // ============================================================================
  // 1. Count Glass Elements
  // ============================================================================
  const glassElements = document.querySelectorAll('.glass, .glass-card, .glass-panel, .glass-subtle, .glass-strong, [class*="backdrop-blur"]');
  console.log(`\n📊 Found ${glassElements.length} glass elements on page`);
  results.metrics.glassElementCount = glassElements.length;

  const glassVariants = {
    subtle: document.querySelectorAll('.glass-subtle, .backdrop-blur-sm, .backdrop-blur-md').length,
    medium: document.querySelectorAll('.glass, .backdrop-blur-lg, .backdrop-blur-xl').length,
    strong: document.querySelectorAll('.glass-strong, .backdrop-blur-2xl, .backdrop-blur-3xl').length
  };
  console.log('   Subtle:', glassVariants.subtle);
  console.log('   Medium:', glassVariants.medium);
  console.log('   Strong:', glassVariants.strong);
  results.metrics.glassVariants = glassVariants;

  // ============================================================================
  // 2. Measure Paint Performance
  // ============================================================================
  console.log('\n🎨 Measuring paint performance...');

  if (window.PerformanceObserver) {
    let paintEntries = [];

    try {
      // Get existing paint entries
      const perfEntries = performance.getEntriesByType('paint');
      paintEntries = perfEntries.map(entry => ({
        name: entry.name,
        startTime: Math.round(entry.startTime * 100) / 100,
        duration: Math.round(entry.duration * 100) / 100
      }));

      console.log('   Paint Entries:');
      paintEntries.forEach(entry => {
        console.log(`     ${entry.name}: ${entry.startTime}ms`);
      });

      results.metrics.paintTiming = paintEntries;
    } catch (e) {
      console.warn('   Could not measure paint timing:', e.message);
    }
  } else {
    console.warn('   PerformanceObserver not supported in this browser');
  }

  // ============================================================================
  // 3. Measure Frame Rate (FPS)
  // ============================================================================
  console.log('\n🎯 Measuring frame rate (5 second test)...');

  const measureFPS = () => {
    return new Promise((resolve) => {
      let frames = 0;
      let lastTime = performance.now();
      const frameTimes = [];
      const duration = 5000; // 5 seconds
      const startTime = performance.now();

      function countFrame() {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        frameTimes.push(delta);
        lastTime = currentTime;
        frames++;

        if (currentTime - startTime < duration) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = Math.round((frames / duration) * 1000);
          const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const maxFrameTime = Math.max(...frameTimes);
          const droppedFrames = frameTimes.filter(t => t > 16.67).length;

          resolve({
            fps,
            avgFrameTime: Math.round(avgFrameTime * 100) / 100,
            maxFrameTime: Math.round(maxFrameTime * 100) / 100,
            droppedFrames,
            totalFrames: frames
          });
        }
      }

      requestAnimationFrame(countFrame);
    });
  };

  measureFPS().then(fpsData => {
    console.log(`   Average FPS: ${fpsData.fps} fps`);
    console.log(`   Avg Frame Time: ${fpsData.avgFrameTime}ms`);
    console.log(`   Max Frame Time: ${fpsData.maxFrameTime}ms`);
    console.log(`   Dropped Frames: ${fpsData.droppedFrames} / ${fpsData.totalFrames}`);
    console.log(`   Performance: ${fpsData.fps >= 60 ? '✅ Excellent' : fpsData.fps >= 50 ? '✅ Good' : '⚠️ Needs Improvement'}`);

    results.metrics.frameRate = fpsData;
  });

  // ============================================================================
  // 4. Measure Memory Usage
  // ============================================================================
  console.log('\n💾 Measuring memory usage...');

  if (performance.memory) {
    const memory = {
      usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100, // MB
      totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100, // MB
      jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100 // MB
    };

    console.log(`   Used JS Heap: ${memory.usedJSHeapSize} MB`);
    console.log(`   Total JS Heap: ${memory.totalJSHeapSize} MB`);
    console.log(`   Heap Limit: ${memory.jsHeapSizeLimit} MB`);
    console.log(`   Usage: ${Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)}%`);

    results.metrics.memory = memory;
  } else {
    console.warn('   Memory API not available (Chrome/Edge only)');
  }

  // ============================================================================
  // 5. Check Compositing Layers
  // ============================================================================
  console.log('\n🖼️  Analyzing compositing layers...');
  console.log('   💡 Open DevTools → More Tools → Layers to see visual layer tree');
  console.log('   💡 Or use DevTools → Rendering → Layer borders to see layers');

  // Estimate layers by counting elements with will-change, transform, or backdrop-filter
  const compositingHints = document.querySelectorAll('[style*="will-change"], [style*="transform"], [class*="backdrop-blur"]').length;
  console.log(`   Estimated compositing layers: ~${compositingHints + 5}-${compositingHints + 15}`);
  results.metrics.estimatedLayers = compositingHints;

  // ============================================================================
  // 6. Check Backdrop Filter Support
  // ============================================================================
  console.log('\n🔍 Checking backdrop-filter support...');

  const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') ||
                                  CSS.supports('-webkit-backdrop-filter', 'blur(10px)');

  console.log(`   Backdrop Filter: ${supportsBackdropFilter ? '✅ Supported' : '❌ Not Supported'}`);

  if (supportsBackdropFilter) {
    const needsPrefix = !CSS.supports('backdrop-filter', 'blur(10px)') &&
                        CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
    console.log(`   Prefix Required: ${needsPrefix ? '⚠️ Yes (-webkit-)' : '✅ No'}`);
  }

  results.metrics.backdropFilterSupport = {
    supported: supportsBackdropFilter,
    needsPrefix: !CSS.supports('backdrop-filter', 'blur(10px)') &&
                 CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
  };

  // ============================================================================
  // 7. Core Web Vitals Estimation
  // ============================================================================
  console.log('\n📈 Core Web Vitals (if available)...');

  // Largest Contentful Paint (LCP)
  try {
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint').pop();
    if (lcpEntry) {
      const lcp = Math.round(lcpEntry.startTime);
      console.log(`   LCP: ${lcp}ms ${lcp < 2500 ? '✅' : lcp < 4000 ? '⚠️' : '❌'} (target: < 2500ms)`);
      results.metrics.lcp = lcp;
    }
  } catch {
    console.log('   LCP: Not available yet');
  }

  // First Input Delay (FID) - requires actual user interaction
  console.log('   FID: Requires user interaction (click/tap something)');

  // Cumulative Layout Shift (CLS)
  try {
    const clsEntries = performance.getEntriesByType('layout-shift');
    let cls = 0;
    clsEntries.forEach(entry => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });
    cls = Math.round(cls * 1000) / 1000;
    console.log(`   CLS: ${cls} ${cls < 0.1 ? '✅' : cls < 0.25 ? '⚠️' : '❌'} (target: < 0.1)`);
    results.metrics.cls = cls;
  } catch {
    console.log('   CLS: Not available');
  }

  // ============================================================================
  // 8. Generate Performance Score
  // ============================================================================
  console.log('\n🏆 Performance Score:');

  let score = 100;
  let issues = [];

  // Deduct points for high element count
  if (glassElements.length > 30) {
    score -= 10;
    issues.push(`High glass element count (${glassElements.length})`);
  } else if (glassElements.length > 20) {
    score -= 5;
    issues.push(`Moderate glass element count (${glassElements.length})`);
  }

  // Deduct points for backdrop-filter support issues
  if (!supportsBackdropFilter) {
    score -= 20;
    issues.push('Backdrop filter not supported');
  }

  results.metrics.performanceScore = {
    score,
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
    issues
  };

  console.log(`   Score: ${score}/100 (${results.metrics.performanceScore.grade})`);
  if (issues.length > 0) {
    console.log('   Issues:');
    issues.forEach(issue => console.log(`     • ${issue}`));
  } else {
    console.log('   ✅ No major issues detected');
  }

  // ============================================================================
  // 9. Recommendations
  // ============================================================================
  console.log('\n💡 Recommendations:');

  if (glassElements.length > 20) {
    console.log('   • Consider virtualizing lists with many glass elements');
    console.log('   • Use Intersection Observer to only apply glass when visible');
  }

  if (glassVariants.strong > 5) {
    console.log('   • Consider using glass-subtle on mobile for better performance');
  }

  if (!supportsBackdropFilter) {
    console.log('   • ⚠️ Provide fallback solid backgrounds for unsupported browsers');
  }

  console.log('   • Test on actual mobile devices for battery/thermal impact');
  console.log('   • Use DevTools → Performance panel for detailed profiling');
  console.log('   • Use DevTools → Rendering → Frame Rendering Stats for FPS monitoring');

  // ============================================================================
  // 10. Export Results
  // ============================================================================
  console.log('\n📊 Full results saved to window.glassPerformanceResults');
  console.log('   To export: copy(JSON.stringify(window.glassPerformanceResults, null, 2))');

  window.glassPerformanceResults = results;

  console.log('\n%c✅ Performance analysis complete!', 'font-size: 16px; font-weight: bold; color: #10b981;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #64748b;');

  return results;
};

// ============================================================================
// Additional Utility: Scroll Performance Test
// ============================================================================
window.measureScrollPerformance = function() {
  console.log('%c🔄 Scroll Performance Test', 'font-size: 18px; font-weight: bold; color: #8b5cf6;');
  console.log('Scroll the page for 5 seconds to measure scroll performance...\n');

  const frameTimes = [];
  let startTime = null;
  let lastScrollTime = performance.now();
  let scrolling = false;
  let animationFrameId;

  function measureFrame() {
    if (scrolling) {
      const now = performance.now();
      const delta = now - lastScrollTime;
      frameTimes.push(delta);
      lastScrollTime = now;
    }
    animationFrameId = requestAnimationFrame(measureFrame);
  }

  function handleScroll() {
    if (!startTime) {
      startTime = performance.now();
      console.log('⏱️  Measuring... (scroll for 5 seconds)');
    }
    scrolling = true;

    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      scrolling = false;

      if (performance.now() - startTime >= 5000) {
        // Stop measuring after 5 seconds
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(animationFrameId);

        // Calculate results
        const validFrames = frameTimes.filter(t => t > 0);
        const avgFrameTime = validFrames.reduce((a, b) => a + b, 0) / validFrames.length;
        const maxFrameTime = Math.max(...validFrames);
        const minFrameTime = Math.min(...validFrames);
        const droppedFrames = validFrames.filter(t => t > 16.67).length;
        const fps = Math.round(1000 / avgFrameTime);

        console.log('\n📊 Scroll Performance Results:');
        console.log(`   Average FPS: ${fps} fps`);
        console.log(`   Avg Frame Time: ${Math.round(avgFrameTime * 100) / 100}ms`);
        console.log(`   Min Frame Time: ${Math.round(minFrameTime * 100) / 100}ms`);
        console.log(`   Max Frame Time: ${Math.round(maxFrameTime * 100) / 100}ms`);
        console.log(`   Dropped Frames: ${droppedFrames} / ${validFrames.length} (${Math.round(droppedFrames / validFrames.length * 100)}%)`);
        console.log(`   Performance: ${fps >= 60 ? '✅ Excellent (60fps)' : fps >= 50 ? '✅ Good (50-60fps)' : fps >= 40 ? '⚠️ Acceptable (40-50fps)' : '❌ Poor (< 40fps)'}`);

        window.scrollPerformanceResults = {
          fps,
          avgFrameTime: Math.round(avgFrameTime * 100) / 100,
          minFrameTime: Math.round(minFrameTime * 100) / 100,
          maxFrameTime: Math.round(maxFrameTime * 100) / 100,
          droppedFrames,
          totalFrames: validFrames.length,
          dropRate: Math.round(droppedFrames / validFrames.length * 100)
        };
      }
    }, 100);
  }

  window.addEventListener('scroll', handleScroll);
  animationFrameId = requestAnimationFrame(measureFrame);

  console.log('💡 To stop early: window.removeEventListener("scroll", arguments.callee)');
};

// ============================================================================
// Additional Utility: Memory Leak Test
// ============================================================================
window.testMemoryLeaks = function() {
  if (!performance.memory) {
    console.error('❌ Memory API not available (Chrome/Edge only)');
    return;
  }

  console.log('%c🔬 Memory Leak Test', 'font-size: 18px; font-weight: bold; color: #ef4444;');
  console.log('Testing memory usage over 10 seconds with repeated interactions...\n');

  const measurements = [];
  let iteration = 0;
  const maxIterations = 20; // 20 iterations over 10 seconds

  function measure() {
    const memory = {
      iteration,
      usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
      totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100
    };

    measurements.push(memory);
    console.log(`   [${iteration}] Used: ${memory.usedJSHeapSize} MB, Total: ${memory.totalJSHeapSize} MB`);

    // Simulate interactions (scroll, hover glass elements)
    window.scrollBy(0, 100);
    setTimeout(() => window.scrollBy(0, -100), 250);

    iteration++;
    if (iteration < maxIterations) {
      setTimeout(measure, 500);
    } else {
      // Analyze results
      const initialMemory = measurements[0].usedJSHeapSize;
      const finalMemory = measurements[measurements.length - 1].usedJSHeapSize;
      const memoryGrowth = finalMemory - initialMemory;
      const growthPercentage = Math.round((memoryGrowth / initialMemory) * 100);

      console.log('\n📊 Memory Leak Analysis:');
      console.log(`   Initial Memory: ${initialMemory} MB`);
      console.log(`   Final Memory: ${finalMemory} MB`);
      console.log(`   Growth: ${Math.round(memoryGrowth * 100) / 100} MB (${growthPercentage}%)`);

      if (memoryGrowth < 5) {
        console.log('   ✅ No significant memory leak detected');
      } else if (memoryGrowth < 20) {
        console.log('   ⚠️ Minor memory growth detected (acceptable)');
      } else {
        console.log('   ❌ Significant memory leak detected - investigate!');
      }

      window.memoryLeakResults = {
        measurements,
        initialMemory,
        finalMemory,
        memoryGrowth,
        growthPercentage
      };
    }
  }

  measure();
};

// Auto-run on load if ?perf=true in URL
if (window.location.search.includes('perf=true')) {
  console.log('🚀 Auto-running performance tests...\n');
  window.measureGlassPerformance();
}

console.log('%c📊 Glass Performance Tools Loaded', 'font-size: 14px; color: #3b82f6;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #64748b;');
console.log('Available functions:');
console.log('  • measureGlassPerformance()    - Full performance analysis');
console.log('  • measureScrollPerformance()   - Scroll FPS test (5 seconds)');
console.log('  • testMemoryLeaks()            - Memory leak detection (10 seconds)');
console.log('\nOr add ?perf=true to URL to auto-run on page load\n');
