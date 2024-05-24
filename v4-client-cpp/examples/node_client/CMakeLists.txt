find_package(json REQUIRED)

file(GLOB_RECURSE SOURCES ${SOURCE_DIR}/*.cpp)
add_executable(dydx_v4_node_client_example ${SOURCES})
target_include_directories(dydx_v4_node_client_example PRIVATE ${INCLUDE_DIR})
target_link_libraries(dydx_v4_node_client_example dydx_v4_client_lib nlohmann_json::nlohmann_json)

# Tests
#enable_testing()
#file(GLOB_RECURSE TEST_SOURCES ${TEST_DIR}/*.cpp)
#add_executable(indexer_client_tests ${TEST_SOURCES})
#target_link_libraries(indexer_client_tests PRIVATE Catch2::Catch2WithMain)
#catch_discover_tests(indexer_clitests)