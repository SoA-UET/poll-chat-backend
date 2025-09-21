# Simple API Server

- [Simple API Server](#simple-api-server)
  - [Cài đặt](#cài-đặt)
  - [Chạy ứng dụng](#chạy-ứng-dụng)
    - [Development](#development)
    - [Development with hot reload](#development-with-hot-reload)
    - [Production](#production)
    - [Run tests](#run-tests)
  - [Chú ý khi viết code](#chú-ý-khi-viết-code)
    - [Swagger API Docs](#swagger-api-docs)
    - [Directory Structure](#directory-structure)
    - [Modules](#modules)
  - [Tác giả](#tác-giả)

## Cài đặt

1. Cài đặt nodejs dependencies:

    ```sh
    npm i
    ```

2. Cài đặt và chạy MongoDB Community Edition.

3. Copy file `.env.example` sang file mới tên là `.env`,
    sau đó sửa các biến cho phù hợp.

## Chạy ứng dụng

### Development

```sh
npm run start
```

Mặc định chạy ở <http://0.0.0.0:3000>

### Development with hot reload

```sh
npm run start:dev
```

### Production

```sh
npm run start:prod
```

### Run tests

```sh
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Chú ý khi viết code

### Swagger API Docs

Truy cập: <http://localhost:3000/api/docs>

OpenAPI JSON: <http://localhost:3000/api-json>

### Directory Structure

    - src/
    |   - users/
    |   |   - users.controller.ts       Controller xử lý người dùng
    |   |   - users.service.ts          Service liên quan
    |   |   - dto/                      Thư mục chứa các DTO
    |   |   |   - create-user.dto.ts    DTO định dạng request khi tạo người dùng mới
    |   |   |   - update-user.dto.ts    DTO định dạng request khi thay đổi thông tin
    |   |   |                           người dùng
    |   |   |   - user.dto.ts           DTO định dạng thông tin người dùng trả về
    |   |   |                           trong response

Khi nhận được HTTP request,
NestJS sẽ gọi controller method
tương ứng. Trong controller method
này sẽ gọi đến service method tương
ứng để xử lý và trả về kết quả.

    HTTP Request ---> Controller ---> Service

                                        |
                                        |
                                        v

    HTTP Response <----------------- Controller

Nghĩa là nên viết service method trước
(trong file `XXX.service.ts`), sau đó
viết controller method (trong file `XXX.controller.ts`).

**Chú ý sử dụng các DTO** để cho phép/ẩn
một số trường nhất định của bảng khi đọc request
hoặc trả về response.

### Modules

Dự án được chia thành các *modules*. Mỗi
module chứa code cho một tính năng (*feature*).

Để thêm một tính năng mới, tạo một
module mới tương ứng:

```sh
nest generate module $MODULE_NAME
```

## Tác giả

**Group 1 - SoA - UET**

- Nguyễn Mạnh Hùng (Captain)
- Lê Thành Đạt
- Lê Bá Hoàng
- Vũ Tùng Lâm
- Khổng Mạnh Tuấn
