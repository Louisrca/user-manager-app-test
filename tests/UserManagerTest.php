<?php

namespace Tests\App;

use App\UserManager;
use PHPUnit\Framework\TestCase;
use PDO;
use PDOStatement;
use InvalidArgumentException;
use Exception;
use ReflectionClass;

class UserManagerTest extends TestCase
{
    private UserManager $userManager;
    private $dbMock;
    private $stmtMock;

    protected function setUp(): void
    {
        $this->dbMock = $this->createMock(PDO::class);

        $this->stmtMock = $this->createMock(PDOStatement::class);

        $this->userManager = new UserManager();

        $reflection = new ReflectionClass(UserManager::class);
        $property = $reflection->getProperty('db');
        $property->setAccessible(true);
        $property->setValue($this->userManager, $this->dbMock);
    }

    public function testAddUser(): void
    {
        $this->dbMock->expects(invocationRule: $this->once())
            ->method('prepare')
            ->with("INSERT INTO users (name, email) VALUES (:name, :email)")
            ->willReturn($this->stmtMock);

        $this->stmtMock->expects($this->once())
            ->method('execute')
            ->with(['name' => 'John Doe', 'email' => 'john@example.com']);

        $this->assertNull($this->userManager->addUser('John Doe', 'john@example.com'));
    }

    public function testAddUserEmailException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage("Email invalide.");

        $this->userManager->addUser('John Doe', 'invalid-email');
    }

    public function testUpdateUser(): void
    {
        $this->dbMock->expects($this->once())
            ->method('prepare')
            ->with("UPDATE users SET name = :name, email = :email WHERE id = :id")
            ->willReturn($this->stmtMock);

        $this->stmtMock->expects($this->once())
            ->method('execute')
            ->with(['id' => 1, 'name' => 'John Updated', 'email' => 'john.updated@example.com']);

        $this->assertNull($this->userManager->updateUser(1, 'John Updated', 'john.updated@example.com'));
    }

    public function testRemoveUser(): void
    {
        $this->dbMock->expects($this->once())
            ->method('prepare')
            ->with("DELETE FROM users WHERE id = :id")
            ->willReturn($this->stmtMock);

        $this->stmtMock->expects($this->once())
            ->method('execute')
            ->with(['id' => 1]);

        $this->assertNull($this->userManager->removeUser(1));
    }

    public function testGetUsers(): void
    {
        $expectedUsers = [
            ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com'],
            ['id' => 2, 'name' => 'Jane Doe', 'email' => 'jane@example.com']
        ];

        $this->dbMock->expects($this->once())
            ->method('query')
            ->with("SELECT * FROM users")
            ->willReturn($this->stmtMock);

        $this->stmtMock->expects($this->once())
            ->method('fetchAll')
            ->willReturn($expectedUsers);

        $result = $this->userManager->getUsers();
        $this->assertEquals($expectedUsers, $result);
    }

    public function testInvalidUpdateThrowsException(): void
    {
        $this->dbMock->expects($this->once())
            ->method('prepare')
            ->with("UPDATE users SET name = :name, email = :email WHERE id = :id")
            ->willReturn($this->stmtMock);

        $this->stmtMock->expects($this->once())
            ->method('execute')
            ->with(['id' => 999, 'name' => 'Inexistant', 'email' => 'inexistant@example.com']);

        $this->stmtMock->expects($this->once())
            ->method('rowCount')
            ->willReturn(0);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Impossible de mettre à jour l'utilisateur. L'ID 999 n'existe pas.");

        $this->userManager->updateUser(999, 'Inexistant', 'inexistant@example.com');
    }

    public function testInvalidDeleteThrowsException(): void
    {
        $this->dbMock->expects($this->once())
            ->method('prepare')
            ->with("DELETE FROM users WHERE id = :id")
            ->willReturn($this->stmtMock);

        $this->stmtMock->expects($this->once())
            ->method('execute')
            ->with(['id' => 999]);

        $this->stmtMock->expects($this->once())
            ->method('rowCount')
            ->willReturn(0);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Impossible de supprimer l'utilisateur. L'ID 999 n'existe pas.");

        $this->userManager->removeUser(999);
    }
}
