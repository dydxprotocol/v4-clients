# Dependencies
find_package(Boost COMPONENTS beast REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(bip3x REQUIRED)
find_package(fmt REQUIRED)
find_package(json REQUIRED)

# Proto files
add_subdirectory(proto)

# Library
file(GLOB_RECURSE SOURCES ${SOURCE_DIR}/*.cpp)
add_library(dydx_v4_client_lib ${SOURCES})
target_include_directories(dydx_v4_client_lib PUBLIC ${INCLUDE_DIR})
target_link_libraries(dydx_v4_client_lib PUBLIC dydx_v4_proto Boost::beast OpenSSL::SSL bip3x fmt nlohmann_json::nlohmann_json)

# Tests
enable_testing()
file(GLOB_RECURSE TEST_SOURCES ${TEST_DIR}/*.cpp)
add_executable(dydx_v4_client_lib_tests ${TEST_SOURCES})
target_link_libraries(dydx_v4_client_lib_tests PRIVATE Catch2::Catch2WithMain dydx_v4_client_lib)
catch_discover_tests(dydx_v4_client_lib_tests)
