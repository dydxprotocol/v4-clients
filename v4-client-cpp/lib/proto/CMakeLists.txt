find_package(Protobuf REQUIRED)
set(PROTOBUF_GENERATE_CPP_APPEND_PATH OFF)
file(GLOB_RECURSE proto_files RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} *.proto)
protobuf_generate_cpp(PROTO_SRCS PROTO_HDRS ${proto_files})

add_library(dydx_v4_proto ${BALOO_BIN_TYPE} ${PROTO_SRCS} ${PROTO_HDRS})
target_include_directories(dydx_v4_proto PUBLIC ${Protobuf_INCLUDE_DIRS} ${CMAKE_CURRENT_BINARY_DIR})
target_link_libraries(dydx_v4_proto PUBLIC ${Protobuf_LIBRARIES})