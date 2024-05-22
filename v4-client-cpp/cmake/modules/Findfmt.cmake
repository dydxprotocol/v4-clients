Include(FetchContent)

set(FETCHCONTENT_QUIET OFF)

FetchContent_Declare(
        fmt
        GIT_REPOSITORY https://github.com/fmtlib/fmt.git
        GIT_TAG 10.1.1
        GIT_PROGRESS TRUE
)

FetchContent_MakeAvailable(fmt)
