find_package(json REQUIRED)

file(GLOB_RECURSE SOURCES ${SOURCE_DIR}/*.cpp)
add_executable(dydx_v4_composite_client_example ${SOURCES})
target_include_directories(dydx_v4_composite_client_example PRIVATE ${INCLUDE_DIR})
target_link_libraries(dydx_v4_composite_client_example dydx_v4_client_lib nlohmann_json::nlohmann_json)