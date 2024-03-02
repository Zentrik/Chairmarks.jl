var documenterSearchIndex = {"docs":
[{"location":"reference/","page":"Reference","title":"Reference","text":"","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Modules = [Chairmarks]","category":"page"},{"location":"reference/#Chairmarks.Sample","page":"Reference","title":"Chairmarks.Sample","text":"Sample\n\nA struct representing a single sample of a benchmark. The fields are internal and subject to change.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Chairmarks.@b-Tuple","page":"Reference","title":"Chairmarks.@b","text":"@b [[init] setup] f [teardown] keywords...\n\nBenchmark f and return the fastest result\n\nUse @be for full results.\n\nPositional argument pipeline syntax\n\nThe four positional arguments form a pipeline with the return value of each passed as an argument to the next. Consequently, the first expression in the pipeline must be a nullary function. If you use a symbol like rand, it will be interpreted as a function and called normally. If you use any other expression, it will be interpreted as the body of a nullary function. For example in @b rand(10) the function being benchmarked is () -> rand(10).\n\nLater positions in the pipeline must be unary functions. As with the first function, you may provide either a function, or an expression. However, the rules are slightly different. If the expression you provide contains an _ as an rvalue (which would otherwise error), it is interpreted as a unary function and any such occurrences of _ are replaced with result from the previous function in the pipeline. For example, in @b rand(10) sort(_, rev=true) the setup function is () -> rand(10) and the primary function is x -> sort(x, rev=true). If the expression you provide does not contain an _ as an rvalue, it is assumed to produce a function and is called with the result from the previous function in the pipeline. For example, in @b rand(10) sort!∘shuffle!, the primary function is simply sort!∘shuffle! and receives no preprocessing. @macroexpand can help elucidate what is going on in specific cases.\n\nPositional argument disambiguation\n\nsetup, teardown, and init are optional and are parsed with that precedence giving these possible forms:\n\n@b f\n@b setup f\n@b setup f teardown\n@b init setup f teardown\n\nYou may use an underscore _ to provide other combinations of arguments. For example, you may provide a teardown and no setup with\n\n@b _ f teardown\n\nKeyword arguments\n\nProvide keyword arguments using name=value syntax similar to how you provide keyword arguments to ordinary functions. Keyword arguments to control executions are\n\nevals::Integer How many function evaluations to perform in each sample. Defaults to automatic calibration.\nsamples::Integer Maximum number of samples to take. Defaults to unlimited and cannot be specified without also specifying evals. Specifying samples = 0 will cause @b to run the warmup sample only and return that sample.\nseconds::Real Maximum amount of time to spend benchmarking. Defaults to 0.1 seconds unless samples is specified in which case it defaults to 1 second. Set to Inf to disable the time limit. Compile time is typically not counted against this limit. A reasonable effort is made to respect the time limit, but it is always exceeded by a small about (less than 1%) and can be significantly exceeded when benchmarking long running functions.\n\nEvaluation model\n\nAt a high level, the implementation of this function looks like this\n\nx = init()\nresults = []\nfor sample in 1:samples\n    y = setup(x)\n\n    t0 = time()\n\n    z = f(y)\n    for _ in 2:evals\n        f(y)\n    end\n\n    push!(results, time()-t0)\n\n    teardown(z)\n\nend\n\nSo init will be called once, setup and teardown will be called once per sample, and f will be called evals times per sample.\n\nExamples\n\njulia> @b rand(10000) # Benchmark a function\n5.833 μs (2 allocs: 78.172 KiB)\n\njulia> @b rand hash # How long does it take to hash a random Float64?\n1.757 ns\n\njulia> @b rand(1000) sort issorted(_) || error() # Simultaneously benchmark and test\n11.291 μs (3 allocs: 18.062 KiB)\n\njulia> @b rand(1000) sort! issorted(_) || error() # BAD! This repeatedly resorts the same array!\n1.309 μs (0.08 allocs: 398.769 bytes)\n\njulia> @b rand(1000) sort! issorted(_) || error() evals=1 # Specify evals=1 to ensure the function is only run once between setup and teardown\n10.041 μs (2 allocs: 10.125 KiB)\n\njulia> @b rand(10) _ sort!∘rand! issorted(_) || error() # Or, include randomization in the benchmarked function and only allocate once\n120.536 ns\n\njulia> @b (x = 0; for _ in 1:50; x = hash(x); end; x) # We can use arbitrary expressions in any position in the pipeline, not just simple functions.\n183.871 ns\n\njulia> @b (x = 0; for _ in 1:5e8; x = hash(x); end; x) # This runs for a long time, so it is only run once (with no warmup)\n2.447 s (without a warmup)\n\n\n\n\n\n","category":"macro"},{"location":"reference/#Chairmarks.@be-Tuple","page":"Reference","title":"Chairmarks.@be","text":"@be [[init] setup] f [teardown] keywords...\n\nBenchmark f and return the results\n\nUse @b for abbreviated results.\n\nPositional argument pipeline syntax\n\nThe four positional arguments form a pipeline with the return value of each passed as an argument to the next. Consequently, the first expression in the pipeline must be a nullary function. If you use a symbol like rand, it will be interpreted as a function and called normally. If you use any other expression, it will be interpreted as the body of a nullary function. For example in @be rand(10) the function being benchmarked is () -> rand(10).\n\nLater positions in the pipeline must be unary functions. As with the first function, you may provide either a function, or an expression. However, the rules are slightly different. If the expression you provide contains an _ as an rvalue (which would otherwise error), it is interpreted as a unary function and any such occurrences of _ are replaced with result from the previous function in the pipeline. For example, in @be rand(10) sort(_, rev=true) the setup function is () -> rand(10) and the primary function is x -> sort(x, rev=true). If the expression you provide does not contain an _ as an rvalue, it is assumed to produce a function and is called with the result from the previous function in the pipeline. For example, in @be rand(10) sort!∘shuffle!, the primary function is simply sort!∘shuffle! and receives no preprocessing. @macroexpand can help elucidate what is going on in specific cases.\n\nPositional argument disambiguation\n\nsetup, teardown, and init are optional and are parsed with that precedence giving these possible forms:\n\n@be f\n@be setup f\n@be setup f teardown\n@be init setup f teardown\n\nYou may use an underscore _ to provide other combinations of arguments. For example, you may provide a teardown and no setup with\n\n@be _ f teardown\n\nKeyword arguments\n\nProvide keyword arguments using name=value syntax similar to how you provide keyword arguments to ordinary functions. Keyword arguments to control executions are\n\nevals::Integer How many function evaluations to perform in each sample. Defaults to automatic calibration.\nsamples::Integer Maximum number of samples to take. Defaults to unlimited and cannot be specified without also specifying evals. Specifying samples = 0 will cause @be to run the warmup sample only and return that sample.\nseconds::Real Maximum amount of time to spend benchmarking. Defaults to 0.1 seconds unless samples is specified in which case it defaults to 1 second. Set to Inf to disable the time limit. Compile time is typically not counted against this limit. A reasonable effort is made to respect the time limit, but it is always exceeded by a small about (less than 1%) and can be significantly exceeded when benchmarking long running functions.\n\nEvaluation model\n\nAt a high level, the implementation of this function looks like this\n\nx = init()\nresults = []\nfor sample in 1:samples\n    y = setup(x)\n\n    t0 = time()\n\n    z = f(y)\n    for _ in 2:evals\n        f(y)\n    end\n\n    push!(results, time()-t0)\n\n    teardown(z)\n\nend\n\nSo init will be called once, setup and teardown will be called once per sample, and f will be called evals times per sample.\n\nExamples\n\njulia> @be rand(10000) # Benchmark a function\nBenchmark: 267 samples with 2 evaluations\nmin    8.500 μs (2 allocs: 78.172 KiB)\nmedian 10.354 μs (2 allocs: 78.172 KiB)\nmean   159.639 μs (2 allocs: 78.172 KiB, 0.37% gc time)\nmax    39.579 ms (2 allocs: 78.172 KiB, 99.93% gc time)\n\njulia> @be rand hash # How long does it take to hash a random Float64?\nBenchmark: 4967 samples with 10805 evaluations\nmin    1.758 ns\nmedian 1.774 ns\nmean   1.820 ns\nmax    5.279 ns\n\njulia> @be rand(1000) sort issorted(_) || error() # Simultaneously benchmark and test\nBenchmark: 2689 samples with 2 evaluations\nmin    9.771 μs (3 allocs: 18.062 KiB)\nmedian 11.562 μs (3 allocs: 18.062 KiB)\nmean   14.933 μs (3 allocs: 18.097 KiB, 0.04% gc time)\nmax    4.916 ms (3 allocs: 20.062 KiB, 99.52% gc time)\n\njulia> @be rand(1000) sort! issorted(_) || error() # BAD! This repeatedly resorts the same array!\nBenchmark: 2850 samples with 13 evaluations\nmin    1.647 μs (0.15 allocs: 797.538 bytes)\nmedian 1.971 μs (0.15 allocs: 797.538 bytes)\nmean   2.212 μs (0.15 allocs: 800.745 bytes, 0.03% gc time)\nmax    262.163 μs (0.15 allocs: 955.077 bytes, 98.95% gc time)\n\njulia> @be rand(1000) sort! issorted(_) || error() evals=1 # Specify evals=1 to ensure the function is only run once between setup and teardown\nBenchmark: 6015 samples with 1 evaluation\nmin    9.666 μs (2 allocs: 10.125 KiB)\nmedian 10.916 μs (2 allocs: 10.125 KiB)\nmean   12.330 μs (2 allocs: 10.159 KiB, 0.02% gc time)\nmax    6.883 ms (2 allocs: 12.125 KiB, 99.56% gc time)\n\njulia> @be rand(10) _ sort!∘rand! issorted(_) || error() # Or, include randomization in the benchmarked function and only allocate once\nBenchmark: 3093 samples with 237 evaluations\nmin    121.308 ns\nmedian 126.055 ns\nmean   128.108 ns\nmax    303.447 ns\n\njulia> @be (x = 0; for _ in 1:50; x = hash(x); end; x) # We can use arbitrary expressions in any position in the pipeline, not just simple functions.\nBenchmark: 3387 samples with 144 evaluations\nmin    183.160 ns\nmedian 184.611 ns\nmean   188.869 ns\nmax    541.667 ns\n\njulia> @be (x = 0; for _ in 1:5e8; x = hash(x); end; x) # This runs for a long time, so it is only run once (with no warmup)\nBenchmark: 1 sample with 1 evaluation\n       2.488 s (without a warmup)\n\n\n\n\n\n","category":"macro"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = Chairmarks\nDocTestSetup = quote\n    using Chairmarks\nend\nDocTestFilters = [r\"\\d\\d?\\d?\\.\\d{3} [μmn]?s( \\(.*\\))?\"]","category":"page"},{"location":"#Chairmarks","page":"Home","title":"Chairmarks","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Chairmarks.jl provides benchmarks with back support. Often hundreds of times faster than BenchmarkTools.jl without compromising on accuracy.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation / Integrating Chairmarks into your workflow","text":"","category":"section"},{"location":"#For-interactive-use","page":"Home","title":"For interactive use","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"There are several ways to use Chairmarks in your interactive sessions, ordered from simplest to install first to most streamlined user experience last.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Add Chairmarks to your default environment with import Pkg; Pkg.activate(); Pkg.add(\"Chairmarks\"). Chairmarks has no non-stdlib dependencies, and precompiles in less than one second, so this should not have any adverse impacts on your environments nor slow load times nor package instillation times.\nAdd Chairmarks to your default environment and put isinteractive() && using Chairmarks in your startup.jl file. This will make Chairmarks available in all your REPL sessions while still requiring and explicit load in scripts and packages. This will slow down launching a new Julia session by a few milliseconds (for comparison, this is about 20x faster than loading Revise in your startup.jl file).\n[Recommended] Add Chairmarks to your default environment and put the following script in your startup.jl file to automatically load it when you type @b or @be in the REPL:","category":"page"},{"location":"","page":"Home","title":"Home","text":"if isinteractive() && (local REPL = get(Base.loaded_modules, Base.PkgId(Base.UUID(\"3fa0cd96-eef1-5676-8a61-b3b8758bbffb\"), \"REPL\"), nothing); REPL !== nothing)\n    # https://github.com/fredrikekre/.dotfiles/blob/65b96f492da775702c05dd2fd460055f0706457b/.julia/config/startup.jl\n    # Automatically load tooling on demand. These packages should be stdlibs or part of the default environment.\n    # - Chairmarks.jl when encountering @b or @be\n    # - add more as desired...\n    local tooling = [\n        [\"@b\", \"@be\"] => :Chairmarks,\n        # add more here...\n    ]\n\n    local tooling_dict = Dict(Symbol(k) => v for (ks, v) in tooling for k in ks)\n    function load_tools(ast)\n        if ast isa Expr\n            if ast.head === :macrocall\n                pkg = get(tooling_dict, ast.args[1], nothing)\n                if pkg !== nothing && !isdefined(Main, pkg)\n                    @info \"Loading $pkg ...\"\n                    try\n                        Core.eval(Main, :(using $pkg))\n                    catch err\n                        @info \"Failed to automatically load $pkg\" exception=err\n                    end\n                end\n            end\n            foreach(load_tools, ast.args)\n        end\n        ast\n    end\n\n    pushfirst!(REPL.repl_ast_transforms, load_tools)\nend","category":"page"},{"location":"#For-regression-testing","page":"Home","title":"For regression testing","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Use RegressionTests.jl! Make a file bench/runbenchmarks.jl with the following content:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Chairmarks, RegressionTests\nusing MyPackage\n\n@track @be MyPackage.compute_thing(1)\n@track @be MyPackage.compute_thing(1000)","category":"page"},{"location":"","page":"Home","title":"Home","text":"And add the following to your test/runtests.jl:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using RegressionTests\n\n@testset \"Regression tests\" begin\n    RegressionTests.test(skip_unsupported_platforms=true)\nend","category":"page"},{"location":"","page":"Home","title":"Home","text":"See the RegressionTests.jl documentation for more information.","category":"page"},{"location":"#Migrating-from-BenchmarkTools.jl","page":"Home","title":"Migrating from BenchmarkTools.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Chairmarks.jl has a similar samples/evals model to BenchmarkTools. It preserves the keyword arguments samples, evals, and seconds. Unlike BenchmarkTools.jl, the seconds argument is honored even as it drops down to the order of 30μs (@b @b hash(rand()) seconds=.00003). While accuracy does decay as the total number of evaluations and samples decreases, it remains quite reasonable (e.g. I see a noise of about 30% when benchmarking @b hash(rand()) seconds=.00003). This makes it much more reasonable to perform meta-analysis such as computing the time it takes to hash a thousand different lengthed arrays with [@b hash(rand(n)) seconds=.001 for n in 1:1000].","category":"page"},{"location":"","page":"Home","title":"Home","text":"Both BenchmarkTools.jl and Chairmarks.jl use an evaluation model structured like this:","category":"page"},{"location":"","page":"Home","title":"Home","text":"init()\nsamples = []\nfor _ in 1:samples\n    setup()\n    t0 = time()\n    for _ in 1:evals\n        f()\n    end\n    t1 = time()\n    push!(samples, t1 - t0)\n    teardown()\nend\nreturn samples","category":"page"},{"location":"","page":"Home","title":"Home","text":"In BenchmarkTools, you specify f and setup with the invocation @benchmark f setup=(setup). In Chairmarks, you specify f and setup with the invocation @be setup f. In BenchmarkTools, setup and f communicate via shared local variables in code generated by BenchmarkTools.jl. In Chairmarks, the function f is passed the return value of the function setup as an argument. Chairmarks also lets you specify teardown, which is not possible with BenchmarkTools, and an init which can be emulated with interpolation using BenchmarkTools.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Here are some examples of corresponding invocations in BenchmarkTools.jl and Chairmarks.jl:","category":"page"},{"location":"","page":"Home","title":"Home","text":"BenchmarkTools.jl Charimarks\n@btime rand(); @b rand()\n@btime sort!(x) setup=(x=rand(100)) evals=1; @b rand(100) sort! evals=1\n@btime sort!(x, rev=true) setup=(x=rand(100)) evals=1; @b rand(100) sort!(_, rev=true) evals=1\n@btime issorted(sort!(x)) || error() setup=(x=rand(100)) evals=1 @b rand(100) sort! issorted(_) || error() evals=1\nlet X = rand(100); @btime issorted(sort!($X)) || error() setup=(rand!($X)) evals=1 end @b rand(100) rand! sort! issorted(_) || error() evals=1","category":"page"},{"location":"","page":"Home","title":"Home","text":"For automated regression tests, RegressionTests.jl is a work in progress replacement for the BenchmarkGroup and @benchmarkable system. Because Chairmarks is efficiently and stably autotuned and RegressionTests.jl is inherently robust to noise, there is no need for parameter caching.","category":"page"},{"location":"#Toplevel-API","page":"Home","title":"Toplevel API","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Chairmarks always returns the benchmark result, while BenchmarkTools mirrors the more diverse base API.","category":"page"},{"location":"","page":"Home","title":"Home","text":"BenchmarkTools Chairmarks Base\nminimum(@benchmark _) @b N/A\n@benchmark @be N/A\n@belapsed (@b _).time @elapsed\n@btime display(@b _); _ @time\nN/A (@b _).allocs @allocations\n@ballocated (@b _).bytes @allocated","category":"page"},{"location":"","page":"Home","title":"Home","text":"Chairmarks may provide @belapsed, @btime, @ballocated, and @ballocations in the future.","category":"page"},{"location":"#Fields","page":"Home","title":"Fields","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Benchmark results have the following fields:","category":"page"},{"location":"","page":"Home","title":"Home","text":"Chairmarks BenchmarkTools Description\nx.time x.time*1e9 Runtime in seconds\nx.time/1e9 x.time Runtime in nanoseconds\nx.allocs x.allocs Number of allocations\nx.bytes x.memory Number of bytes allocated across all allocations\nx.gc_fraction x.gctime / x.time Fraction of time spent in garbage collection\nx.gc_time*x.time x.gctime Time spent in garbage collection\nx.compile_fraction N/A Fraction of time spent compiling\nx.recompile_fraction N/A Fraction of time spent compiling which was on recompilation\nx.warmup true weather or not the sample had a warmup run before it\nx.checksum N/A a checksum computed from the return values of the benchmarked code\nx.evals x.params.evals the number of evaluations in the sample","category":"page"},{"location":"","page":"Home","title":"Home","text":"Note that these fields are likely to change in Chairmarks 1.0.","category":"page"},{"location":"#Nonconstant-globals-and-interpolation","page":"Home","title":"Nonconstant globals and interpolation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The arguments to Chairmarks.jl are lowered to functions, not quoted expressions. Consequently, there is no need to interpolate variables and interpolation is therefore not supported. Like BenchmarkTools.jl, benchmarks that includes access to nonconstant globals will receive a performance overhead for that access. Two possible ways to avoid this are to make the global constant, and to include it in the setup or initiaization phase. For example,","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> x = 6 # nonconstant global\n6\n\njulia> @b rand(x) # slow\n39.616 ns (1.02 allocs: 112.630 bytes)\n\njulia> @b x rand # fast\n18.939 ns (1 allocs: 112 bytes)\n\njulia> const X = x\n6\n\njulia> @b rand(X) # fast\n18.860 ns (1 allocs: 112 bytes)","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"CurrentModule = Chairmarks\nDocTestSetup = quote\n    using Chairmarks\nend\nDocTestFilters = [r\"\\d\\d?\\d?\\.\\d{3} [μmn]?s( \\(.*\\))?\"]","category":"page"},{"location":"why/#Precise","page":"Why use Chairmarks?","title":"Precise","text":"","category":"section"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"Capable of detecting 1% difference in runtime in ideal conditions","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"julia> f(n) = sum(rand() for _ in 1:n)\nf (generic function with 1 method)\n\njulia> @b f(1000)\n1.074 μs\n\njulia> @b f(1000)\n1.075 μs\n\njulia> @b f(1000)\n1.076 μs\n\njulia> @b f(1010)\n1.086 μs\n\njulia> @b f(1010)\n1.087 μs\n\njulia> @b f(1010)\n1.087 μs","category":"page"},{"location":"why/#Concise","page":"Why use Chairmarks?","title":"Concise","text":"","category":"section"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"Chairmarks uses a concise pipeline syntax to define benchmarks. When providing a single argument, that argument is automatically wrapped in a function for higher performance and executed","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"julia> @b sort(rand(100))\n1.500 μs (3 allocs: 2.625 KiB)","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"When providing two arguments, the first is setup code and only the runtime of the second is measured","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"julia> @b rand(100) sort\n1.018 μs (2 allocs: 1.750 KiB)","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"You may use _ in the later arguments to refer to the output of previous arguments","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"julia> @b rand(100) sort(_, by=x -> exp(-x))\n5.521 μs (2 allocs: 1.750 KiB)","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"A third argument can run a \"teardown\" function to integrate testing into the benchmark and ensure that the benchmarked code is behaving correctly","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"julia> @b rand(100) sort(_, by=x -> exp(-x)) issorted(_) || error()\nERROR:\nStacktrace:\n [1] error()\n[...]\n\njulia> @b rand(100) sort(_, by=x -> exp(-x)) issorted(_, rev=true) || error()\n5.358 μs (2 allocs: 1.750 KiB)","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"See @b for more info","category":"page"},{"location":"why/#Truthful","page":"Why use Chairmarks?","title":"Truthful","text":"","category":"section"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"Charimarks.jl automatically computes a checksum based on the results of the provided computations, and returns that checksum to the user along with benchmark results. This makes it impossible for the compiler to elide any part of the computation that has an impact on its return value.","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"While the checksums are fast, one negative side effect of this is that they add a bit of overhead to the measured runtime, and that overhead can vary depending on the function being benchmarked. These checksums are performed by computing a map over the returned values and a reduction over those mapped values. You can disable this by passing the checksum=false keyword argument, possibly in combination with a custom teardown function that verifies computation results. Be aware that as the compiler improves, it may become better at eliding benchmarks whose results are not saved.","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"julia> @b 1\n0.713 ns\n\njulia> @b 1.0\n1.135 ns\n\njulia> @b 1.0 checksum=false\n0 ns","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"You may experiment with custom reductions using the internal _map and _reduction keyword arguments. The default maps and reductions (Chairmarks.default_map and Chairmarks.default_reduction) are internal and subject to change and/or removal in future.","category":"page"},{"location":"why/#Efficient","page":"Why use Chairmarks?","title":"Efficient","text":"","category":"section"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":" Chairmarks.jl BenchmarkTools.jl Ratio\nTTFX 3.4s 13.4s 4x\nTTFX excluding precompilation 43ms 1118ms 26x\nLoad time 4.2ms 131ms 31x\nminimum runtime 34μs 459ms 13,500x","category":"page"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"See https://github.com/LilithHafner/Chairmarks.jl/blob/main/contrib/ttfx_rm_rf_julia.sh for methodology.","category":"page"},{"location":"why/#Innate-qualities","page":"Why use Chairmarks?","title":"Innate qualities","text":"","category":"section"},{"location":"why/","page":"Why use Chairmarks?","title":"Why use Chairmarks?","text":"Charimarks is inherently narrower than BenchmarkTools by construction. It also has more reliable back support. Back support is a defining feature of chairs while benches are known to sometimes lack back support.","category":"page"}]
}
