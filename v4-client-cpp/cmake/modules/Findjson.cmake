Include(FetchContent)

set(FETCHCONTENT_QUIET OFF)

FetchContent_Declare(
        json
        GIT_REPOSITORY https://github.com/nlohmann/json.git
        GIT_TAG v3.11.3
        GIT_PROGRESS TRUE
)

FetchContent_MakeAvailable(json)
