Include(FetchContent)

set(FETCHCONTENT_QUIET OFF)

FetchContent_Declare(
        bip3x
        GIT_REPOSITORY https://github.com/asnefedovv/dydx-v4-cpp-dep-bip3x.git
        GIT_TAG 3.0.0
        GIT_PROGRESS TRUE
)

FetchContent_MakeAvailable(bip3x)
