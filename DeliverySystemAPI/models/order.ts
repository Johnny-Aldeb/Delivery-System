import { Model, DataTypes, Optional, Association } from "sequelize";
import { sequelize } from "../config";

interface OrderAttributes {
  id: number;
  packageId: number;
  paymentId: number;
  senderId: number;
  driverId: number | null;
  recipientFirstName: string;
  recipientLastName: string;
  recipientAddress: string;
  senderAddress: string;
  trackingNumber: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public packageId!: number;
  public paymentId!: number;
  public senderId!: number;
  public driverId!: number;
  public recipientFirstName!: string;
  public recipientLastName!: string;
  public recipientAddress!: string;
  public senderAddress!: string;
  public trackingNumber!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Order.belongsTo(models.User, {
      foreignKey: "senderId",
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    Order.belongsTo(models.Package, {
      foreignKey: "packageId",
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    Order.belongsTo(models.Payment, {
      foreignKey: "paymentId",
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  }
}

// Initialize the User model
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    recipientFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "Orders",
  }
);
