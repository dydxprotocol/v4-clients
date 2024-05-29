Include(FetchContent)

set(FETCHCONTENT_QUIET OFF)

FetchContent_Declare(
        Catch2
        GIT_REPOSITORY https://github.com/catchorg/Catch2.git
        GIT_TAG v3.4.0
        GIT_PROGRESS TRUE
)

FetchContent_MakeAvailable(Catch2)
